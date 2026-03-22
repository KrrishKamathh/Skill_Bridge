import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mockup jobs...');

  const jobs = [
    {
      title: 'AI Machine Learning Engineer',
      description: 'Develop and deploy large-scale ML models using PyTorch and TensorFlow.',
      company: 'NeuralFlow AI',
      location: 'Remote',
      salary: '$120k - $160k',
      requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'SQL']
    },
    {
      title: 'Senior Fullstack Developer',
      description: 'Build modern web applications using the T3 stack.',
      company: 'AppForge',
      location: 'San Francisco',
      salary: '$140k - $180k',
      requiredSkills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind']
    },
    {
      title: 'Creative UI/UX Designer',
      description: 'Design beautiful and intuitive user interfaces for mobile and web.',
      company: 'PixelPerfect',
      location: 'New York / Remote',
      salary: '$90k - $130k',
      requiredSkills: ['Figma', 'CSS', 'Adobe XD', 'Sketch']
    }
  ];

  for (const jobData of jobs) {
    // 1. Ensure skills exist
    const skillIds = await Promise.all(
      jobData.requiredSkills.map(async (name) => {
        const skill = await prisma.skill.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        return { id: skill.id };
      })
    );

    // 2. Create Job (linking to a dummy recruiter if needed, or just create floating)
    // For now, let's just create jobs. Since Job needs a recruiterId, I'll find the first RECRUITER or skip.
    // 2. Find or Create a Recruiter
    let recruiterUser = await prisma.user.findFirst({
      where: { role: 'RECRUITER' }
    });

    if (!recruiterUser) {
      console.log('No recruiter found, creating a dummy recruiter...');
      recruiterUser = await prisma.user.create({
        data: {
          name: 'Global Recruiter',
          email: 'recruiter@skillbridge.ai',
          password: 'hashed_password_here', // In real app, use bcrypt
          role: 'RECRUITER'
        }
      });
    }

    const rp = await prisma.recruiterProfile.upsert({
      where: { userId: recruiterUser.id },
      update: {},
      create: { userId: recruiterUser.id, company: jobData.company }
    });

      await prisma.job.create({
        data: {
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.description, // Re-use description as requirements for seed
          location: jobData.location,
          salary: jobData.salary,
          recruiterId: rp.id,
          skills: {
            connect: skillIds
          }
        }
      });
    console.log(`Created job: ${jobData.title}`);
  }

  console.log('Seed finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
