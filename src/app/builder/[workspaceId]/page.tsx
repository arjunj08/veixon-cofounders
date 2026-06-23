'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function WorkspacePage() {
  const params = useParams()
  const workspaceId = params.workspaceId as string

  const [statusData, setStatusData] = useState<any>(null)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Poll for status every 5 seconds
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/builder/status?startupId=${workspaceId}`)
        const data = await res.json()
        setStatusData(data)
      } catch (e) {
        console.error('Failed to fetch workspace status:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [workspaceId])

  const submitFeedback = async (artifactId: string) => {
    await fetch('/api/builder/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifactId, feedback })
    })
    setFeedback('')
  }

  const approveArtifact = async (artifactId: string) => {
    await fetch('/api/builder/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifactId })
    })
  }

  if (loading) return <div className="p-8 text-white">Loading Workspace...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Product Builder Workspace</h1>
        
        <div className="grid grid-cols-3 gap-8">
          
          {/* Main Artifact Area */}
          <div className="col-span-2 space-y-8">
            {statusData?.artifacts?.length === 0 ? (
              <div className="bg-gray-800 p-6 rounded-lg text-gray-400">
                No artifacts generated yet. Agents are thinking...
              </div>
            ) : (
              statusData?.artifacts?.map((artifact: any) => (
                <div key={artifact._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold capitalize">{artifact.artifactType} Document (v{artifact.version})</h2>
                    {artifact.isApproved ? (
                      <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">Approved</span>
                    ) : (
                      <span className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded-full text-sm">Review Required</span>
                    )}
                  </div>
                  
                  <div className="bg-black p-4 rounded text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap mb-4">
                    {JSON.stringify(artifact.content, null, 2)}
                  </div>

                  {!artifact.isApproved && (
                    <div className="space-y-4">
                      <textarea
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white"
                        placeholder="Provide feedback to the agent to revise this document..."
                        rows={3}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <div className="flex gap-4">
                        <button 
                          onClick={() => submitFeedback(artifact._id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                          Request Revision
                        </button>
                        <button 
                          onClick={() => approveArtifact(artifact._id)}
                          className="bg-[#534AB7] hover:bg-[#433A97] text-white px-4 py-2 rounded"
                        >
                          Approve & Proceed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Sidebar / Job Logs */}
          <div className="col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Agent Activity</h3>
              <div className="space-y-4 max-h-[80vh] overflow-y-auto">
                {statusData?.jobs?.map((job: any) => (
                  <div key={job._id} className="border-l-2 border-[#0F6E56] pl-4 py-2">
                    <p className="text-sm font-medium text-gray-300">{job.agentRole}</p>
                    <p className="text-xs text-gray-500">{new Date(job.startedAt).toLocaleTimeString()}</p>
                    <div className="mt-2 space-y-1">
                      {job.logs?.map((log: any, i: number) => (
                        <p key={i} className="text-xs text-gray-400">&gt; {log.message}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
