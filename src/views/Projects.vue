<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

const { t } = useI18n()

const selectedProject = ref(null)

const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    tech: ['Vue', 'Node.js', 'MongoDB'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  },
  {
    id: 2,
    title: 'Social Media Dashboard',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    longDescription: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    tech: ['React', 'GraphQL', 'PostgreSQL'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  },
  {
    id: 3,
    title: 'AI-Powered Analytics',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    longDescription: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    tech: ['Python', 'TensorFlow', 'Flask'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  },
  {
    id: 4,
    title: 'Mobile Fitness App',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    longDescription: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tech: ['React Native', 'Firebase', 'Redux'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  },
  {
    id: 5,
    title: 'Smart Home IoT Platform',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    longDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    tech: ['Angular', 'Node.js', 'MongoDB'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  },
  {
    id: 6,
    title: 'Blockchain Wallet',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
    longDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    tech: ['Web3.js', 'React', 'Solidity'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  },
  {
    id: 7,
    title: 'AR Shopping Experience',
    description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    longDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    tech: ['Unity', 'ARKit', 'C#'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  },
  {
    id: 8,
    title: 'Cloud Infrastructure Monitor',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
    longDescription: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    tech: ['AWS', 'Docker', 'Kubernetes'],
    image: 'https://via.placeholder.com/800x600',
    gallery: [
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600',
      'https://via.placeholder.com/800x600'
    ]
  }
]

const openProject = (project: any) => {
  selectedProject.value = project
  gsap.to('.project-details', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'back.out(1.7)'
  })
}

const closeProject = () => {
  gsap.to('.project-details', {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      selectedProject.value = null
    }
  })
}

onMounted(() => {
  gsap.from('.project-card', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top center+=100',
      toggleActions: 'play none none reverse'
    }
  })
})
</script>

<template>
  <div class="section">
    <div class="container pt-20">
      <h1 class="text-4xl md:text-5xl font-light text-white text-center mb-12 tracking-wider">
        {{ t('projects.title') }}
      </h1>
      <div class="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="project-card group cursor-pointer"
          @click="openProject(project)"
        >
          <div class="relative overflow-hidden rounded-lg mb-4">
            <img 
              :src="project.image" 
              :alt="project.title"
              class="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h3 class="text-xl font-light text-white mb-2 tracking-wide">
            {{ project.title }}
          </h3>
          <p class="text-gray-400 mb-4">
            {{ project.description }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tech in project.tech" 
              :key="tech"
              class="px-3 py-1 text-sm bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <!-- Project Details Modal -->
      <div 
        v-if="selectedProject"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="closeProject"
      >
        <div class="project-details max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto opacity-0 scale-95">
          <div class="card">
            <div class="flex justify-between items-start mb-6">
              <h2 class="text-3xl font-light text-white tracking-wide">
                {{ selectedProject.title }}
              </h2>
              <button 
                @click="closeProject"
                class="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div class="space-y-4">
                <img 
                  :src="selectedProject.image" 
                  :alt="selectedProject.title"
                  class="w-full rounded-lg shadow-lg"
                >
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tech in selectedProject.tech" 
                    :key="tech"
                    class="px-3 py-1 text-sm bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
              
              <div class="space-y-4">
                <p class="text-gray-300">
                  {{ selectedProject.longDescription }}
                </p>
                
                <div class="grid grid-cols-2 gap-4">
                  <img 
                    v-for="(image, index) in selectedProject.gallery.slice(0, 4)"
                    :key="index"
                    :src="image"
                    :alt="`${selectedProject.title} gallery ${index + 1}`"
                    class="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-4">
              <button class="btn btn-primary">
                View Live Demo
              </button>
              <button class="btn bg-white/5 text-white border border-white/10 hover:bg-white/10">
                View Source
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-details {
  transform-origin: center center;
}

.section {
  background: radial-gradient(circle at 50% -20%, #1a365d 0%, transparent 50%),
              radial-gradient(circle at 50% 120%, #1e40af 0%, transparent 50%);
}
</style>