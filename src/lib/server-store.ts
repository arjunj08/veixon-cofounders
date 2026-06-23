import { randomUUID } from 'crypto'
import prisma from './prisma'
import type { StartupRecord } from './types'

export function newId(prefix: string) {
  return `${prefix}_${randomUUID()}`
}

export async function saveStartup(record: any) {
  // Prisma needs JSON to be stringified for string fields, but since record is loosely typed here,
  // we serialize complex nested objects.
  // Drop relation fields that callers pass as plain arrays (e.g. completedTasks: []).
  // Prisma rejects scalar arrays on relation fields, so strip them out before create.
  const {
    completedTasks,
    taskEdits,
    tractionDetails,
    introRequests,
    pivotAlerts,
    competitorNotes,
    dayDebriefs,
    weekAnalyses,
    decisionFollowUps,
    weekUnlockStatus,
    workspaces,
    decisions,
    ...scalar
  } = record

  const serializedRecord = {
    ...scalar,
    scorecardJson: record.scorecardJson ? JSON.stringify(record.scorecardJson) : null,
    warPlanJson: record.warPlanJson ? JSON.stringify(record.warPlanJson) : null,
    devilsAdvocateJson: record.devilsAdvocateJson ? JSON.stringify(record.devilsAdvocateJson) : null,
    founderDNA: record.founderDNA ? JSON.stringify(record.founderDNA) : null,
  }

  const result = await prisma.startup.create({
    data: serializedRecord
  })
  return result
}

function parseStartup(found: any) {
  if (!found) return null
  return {
    ...found,
    scorecardJson: found.scorecardJson ? JSON.parse(found.scorecardJson) : null,
    warPlanJson: found.warPlanJson ? JSON.parse(found.warPlanJson) : null,
    devilsAdvocateJson: found.devilsAdvocateJson ? JSON.parse(found.devilsAdvocateJson) : null,
    founderDNA: found.founderDNA ? JSON.parse(found.founderDNA) : null,
  }
}

export async function getStartupById(id: string) {
  const found = await prisma.startup.findUnique({ where: { id } })
  return parseStartup(found)
}

export const getStartup = getStartupById

export async function getLatestStartup(userId: string) {
  const found = await prisma.startup.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  return parseStartup(found)
}

export async function updateStartup(id: string, update: any) {
  const serializedUpdate = {
    ...update,
    scorecardJson: update.scorecardJson ? JSON.stringify(update.scorecardJson) : undefined,
    warPlanJson: update.warPlanJson ? JSON.stringify(update.warPlanJson) : undefined,
    devilsAdvocateJson: update.devilsAdvocateJson ? JSON.stringify(update.devilsAdvocateJson) : undefined,
    founderDNA: update.founderDNA ? JSON.stringify(update.founderDNA) : undefined,
  }
  
  await prisma.startup.update({
    where: { id },
    data: serializedUpdate
  })
}

export async function saveDecision(record: any) {
  const serializedRecord = {
    ...record,
    optionsJson: record.optionsJson ? JSON.stringify(record.optionsJson) : null,
  }
  return await prisma.decision.create({ data: serializedRecord })
}

function parseDecision(found: any) {
  if (!found) return null
  return {
    ...found,
    optionsJson: found.optionsJson ? JSON.parse(found.optionsJson) : null,
  }
}

export async function getDecisionById(id: string) {
  const found = await prisma.decision.findUnique({ where: { id } })
  return parseDecision(found)
}

export async function listDecisions(userId: string) {
  // We need to fetch decisions for startups owned by this user
  const startups = await prisma.startup.findMany({
    where: { userId },
    select: { id: true }
  })
  const startupIds = startups.map(s => s.id)

  const found = await prisma.decision.findMany({
    where: { startupId: { in: startupIds } },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  return found.map(parseDecision)
}

export async function saveCheckin(record: any) {
  const serializedRecord = {
    ...record,
    tasksJson: record.tasksJson ? JSON.stringify(record.tasksJson) : null,
  }
  return await prisma.checkin.create({ data: serializedRecord })
}

function parseCheckin(found: any) {
  if (!found) return null
  return {
    ...found,
    tasksJson: found.tasksJson ? JSON.parse(found.tasksJson) : null,
  }
}

export async function getCheckinById(id: string) {
  const found = await prisma.checkin.findUnique({ where: { id } })
  return parseCheckin(found)
}

export async function getLatestCheckin(userId: string) {
  const found = await prisma.checkin.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } })
  return parseCheckin(found)
}
