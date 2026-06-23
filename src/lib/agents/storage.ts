import Artifact from '@/models/Artifact'
import { CodeArtifact } from './frontend'

export async function persistCodeArtifacts(workspaceId: string, files: CodeArtifact[]) {
  // Save each file as a 'code' artifact in MongoDB
  const artifactPromises = files.map(file => {
    return Artifact.create({
      workspaceId,
      artifactType: 'code',
      content: file,
      version: 1,
      isApproved: false
    })
  })

  await Promise.all(artifactPromises)
  
  // TODO: Add logic here to physically write these files to a 'generated_projects/[workspaceId]' directory
  // and initialize a git repository, then push to GitHub via an octokit integration.
  // Example:
  // fs.mkdirSync(\`./generated_projects/\${workspaceId}\`, { recursive: true })
  // fs.writeFileSync(\`./generated_projects/\${workspaceId}/\${file.filePath}\`, file.code)
  
  return true
}
