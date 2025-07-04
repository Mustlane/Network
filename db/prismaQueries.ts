import { PrismaClient } from "../generated/prisma";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function getEnabledUsers() {
  const getEnabledUsers = await prisma.user.count({
  })
  return getEnabledUsers
}

async function getThisDayUsers() {
  const getThisDayUsers = await prisma.user.findMany({
    where: {
      lastSeen: {
        gte: dayjs().subtract(1, "day").toISOString(),
      },
    },
  });
  return getThisDayUsers.length
}

async function getThisWeekUsers() {
  const getThisWeekUsers = await prisma.user.findMany({
    where: {
      lastSeen: {
        gte: dayjs().subtract(7, "day").toISOString(),
      },
    },
  });
  return getThisWeekUsers.length
}

async function getThisMonthUsers() {
  const getThisMonthUsers = await prisma.user.findMany({
    where: {
      lastSeen: {
        gte: dayjs().subtract(30, "day").toISOString(),
      },
    },
  });
  return getThisMonthUsers.length
}

async function getRequests() {
  const requests = await prisma.requests.findMany({
  })
  return requests.length
}

async function getDoneRequests() {
  const doneRequests = await prisma.requests.findMany({
    where:{
      isDone: true
    }
  })
  return doneRequests.length
}

async function userCreate(username: string, password: string) {
  await prisma.user.create({
    data: {
      username: username, 
      password: password
    }
  })
}

async function userFindByName(username: string) {
  const userFindByName = await prisma.user.findFirst({
    where:{
      username: username
    }
  })
  return userFindByName
}

async function userFindById(id: string) {
  const userFindById = await prisma.user.findFirst({
    where:{
      id: id
    }
  })
  return userFindById
}

export {
    getEnabledUsers,
    getThisDayUsers,
    getThisWeekUsers,
    getThisMonthUsers,
    getRequests,
    getDoneRequests,
    userCreate,
    userFindByName,
    userFindById
}