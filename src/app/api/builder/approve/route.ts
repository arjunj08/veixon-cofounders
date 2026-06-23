import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { artifactId } = await req.json()

    if (!artifactId) {
      return NextResponse.json({ error: 'artifactId is required' }, { status: 400 })
    }

    const artifact = await prisma.artifact.findUnique({
      where: { id: artifactId }
    })
    
    if (!artifact) {
      return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
    }

    // Mark as approved
    await prisma.artifact.update({
      where: { id: artifactId },
      data: {
        isApproved: true,
        humanFeedback: null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Approval submission error:', error)
    return NextResponse.json({ error: 'Failed to approve artifact', details: error.message }, { status: 500 })
  }
}
