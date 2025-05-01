import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function seedRoles() {
  console.log('Seeding roles...')

  const roles = [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]

  await roles.forEach(async role => {
    try {
      const existingRole = await prisma.role.findUnique({
        where: { name: role },
      })

      if (!existingRole) {
        await prisma.role.create({
          data: {
            name: role,
          },
        })
        console.log(`Role '${role}' created!`)
      } else {
        console.log(`Role '${role}' already exists.`)
      }
    } catch (err) {
      console.error(`Failed to seed role '${role}':`, err)
    }
  })
}

async function main() {
  // Call seed functions here
  await seedRoles()
  console.log('Roles seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
