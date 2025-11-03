import dotenv from 'dotenv'
import connectDB from '../config/database.js'
import { initUserModel } from '../models/User.js'

dotenv.config()

async function createUser(username, email, password) {
  try {
    console.log('🚀 连接数据库...')
    await connectDB()

    const User = initUserModel()
    if (!User) {
      console.error('❌ 数据库不可用，无法创建用户')
      process.exit(1)
    }

    // 确保表已创建
    console.log('🛠️ 确保 users 表存在...')
    await User.sync()

    console.log('🔍 检查用户是否已存在...')
    const existing = await User.findOne({ where: { email } })
    if (existing) {
      console.log('⚠️ 用户已存在：')
      console.log(JSON.stringify(existing.profile, null, 2))
      process.exit(0)
    }

    console.log('📝 创建用户...')
    const user = await User.create({ username, email, password })

    console.log('✅ 用户创建成功：')
    console.log(JSON.stringify(user.profile, null, 2))
    process.exit(0)
  } catch (err) {
    console.error('❌ 创建用户失败：', err?.message || err)
    process.exit(1)
  }
}

const [,, username, email, password] = process.argv
if (!username || !email || !password) {
  console.error('用法：node scripts/createUser.js <username> <email> <password>')
  process.exit(1)
}

createUser(username, email, password)