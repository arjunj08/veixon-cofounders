const fs = require('fs');
const path = require('path');

const filesToRefactor = [
  'app/api/cron/morning-briefing/route.ts',
  'app/api/cron/monday-missile/route.ts',
  'app/api/cron/evening-reminder/route.ts',
  'app/api/builder/status/route.ts',
  'app/api/builder/orchestrate/route.ts',
  'app/api/builder/feedback/route.ts',
];

filesToRefactor.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace connectMongo
    content = content.replace(/import \{ connectMongo \} from '@\/lib\/mongodb'/g, "import prisma from '@/lib/prisma'");
    content = content.replace(/await connectMongo\(\)/g, "");
    
    // Replace model imports
    content = content.replace(/import [A-Za-z]+ from '@\/models\/[A-Za-z]+'/g, "");
    
    // Replace User.find(...) with prisma.user.findMany(...)
    content = content.replace(/User\.find\(/g, "prisma.user.findMany(");
    content = content.replace(/Startup\.find\(/g, "prisma.startup.findMany(");
    content = content.replace(/Workspace\.find\(/g, "prisma.workspace.findMany(");
    content = content.replace(/AgentJob\.find\(/g, "prisma.agentJob.findMany(");
    content = content.replace(/Artifact\.find\(/g, "prisma.artifact.findMany(");
    
    // Replace findOne
    content = content.replace(/User\.findOne\(/g, "prisma.user.findFirst(");
    content = content.replace(/Startup\.findOne\(/g, "prisma.startup.findFirst(");
    content = content.replace(/Workspace\.findOne\(/g, "prisma.workspace.findFirst(");
    content = content.replace(/AgentJob\.findOne\(/g, "prisma.agentJob.findFirst(");
    content = content.replace(/Artifact\.findOne\(/g, "prisma.artifact.findFirst(");

    // Replace findById
    content = content.replace(/User\.findById\(([^)]+)\)/g, "prisma.user.findUnique({ where: { id: $1 } })");
    content = content.replace(/Startup\.findById\(([^)]+)\)/g, "prisma.startup.findUnique({ where: { id: $1 } })");
    content = content.replace(/Workspace\.findById\(([^)]+)\)/g, "prisma.workspace.findUnique({ where: { id: $1 } })");
    content = content.replace(/AgentJob\.findById\(([^)]+)\)/g, "prisma.agentJob.findUnique({ where: { id: $1 } })");
    content = content.replace(/Artifact\.findById\(([^)]+)\)/g, "prisma.artifact.findUnique({ where: { id: $1 } })");

    // Replace lean()
    content = content.replace(/\.lean\(\)/g, "");
    
    fs.writeFileSync(fullPath, content);
    console.log(`Refactored ${relPath}`);
  }
});
