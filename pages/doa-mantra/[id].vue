<template>
  <div class="min-h-screen bg-base flex flex-col animate-fade-up">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-30 bg-base/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-default">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-surface transition-colors">
        <Icon name="lucide:arrow-left" class="w-6 h-6 text-default" />
      </button>
      <div class="flex items-center gap-2">
        <button @click="toggleBookmark" class="p-2 rounded-full hover:bg-surface transition-colors">
          <Icon :name="isBookmarked ? 'lucide:bookmark-check' : 'lucide:bookmark'" 
                :class="isBookmarked ? 'text-brand' : 'text-muted'" class="w-6 h-6" />
        </button>
        <button @click="handleShare" class="p-2 rounded-full hover:bg-surface transition-colors">
          <Icon name="lucide:share-2" class="w-6 h-6 text-muted" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 py-8 flex-grow">
      <div class="text-center mb-10">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-2 block">Doa & Mantra</span>
        <h1 class="font-serif text-3xl font-bold text-default leading-tight">Panca Sembah</h1>
        <p class="text-muted text-sm mt-3 font-serif italic">Kramaning Sembah</p>
      </div>

      <div class="space-y-12">
        <div v-for="(section, idx) in content" :key="idx" class="relative">
          <div class="absolute -left-4 top-0 h-full w-1 bg-brand/10 rounded-full"></div>
          
          <h3 class="font-bold text-brand text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-brand text-inverse flex items-center justify-center text-[10px]">{{ idx + 1 }}</span>
            Bait {{ idx + 1 }}
          </h3>

          <div class="space-y-6">
            <!-- Sansekerta -->
            <p class="font-serif text-xl font-bold text-brand text-center leading-relaxed italic">
              {{ section.sanskrit }}
            </p>
            
            <!-- Transliterasi -->
            <p class="text-sm text-default text-center leading-loose font-medium opacity-80">
              {{ section.transliteration }}
            </p>
            
            <!-- Terjemahan -->
            <div class="bg-surface/50 p-4 rounded-xl border border-default shadow-sm text-default">
              <p class="text-xs text-muted leading-relaxed text-center">
                <span class="font-bold block mb-1 text-default">Artinya:</span>
                {{ section.translation }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Player (Floating) -->
    <div class="fixed bottom-24 left-6 right-6 z-40">
      <div class="bg-elevated text-default p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-default">
        <button @click="isPlaying = !isPlaying" class="w-12 h-12 rounded-xl bg-brand flex items-center justify-center active:scale-95 transition-all">
          <Icon :name="isPlaying ? 'lucide:pause' : 'lucide:play'" class="w-6 h-6 text-inverse" />
        </button>
        <div class="flex-grow">
          <p class="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">Dengarkan Audio</p>
          <div class="h-1 bg-default/10 rounded-full overflow-hidden">
            <div class="h-full bg-brand w-1/3"></div>
          </div>
        </div>
        <Icon name="lucide:volume-2" class="w-5 h-5 text-muted" />
      </div>
    </div>
  </div>
</template>

<script setup>
const isPlaying = ref(false)
const isBookmarked = ref(false)

const toggleBookmark = () => isBookmarked.value = !isBookmarked.value

const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: 'Panca Sembah',
      text: 'Mari kita berdoa kramaning sembah hari ini.',
      url: window.location.href
    })
  }
}

const content = [
  {
    sanskrit: "Om atma tattvatma suddha mam svaha",
    transliteration: "Om atma tattvatma suddha mam svaha",
    translation: "Ya Tuhan, Atman hukum Atman, sucikanlah hamba-Mu."
  },
  {
    sanskrit: "Om ksama sampurna ya namah svaha",
    transliteration: "Om ksama sampurna ya namah svaha",
    translation: "Ya Tuhan, sampaikanlah maaf hamba yang sempurna bagi-Mu."
  }
]
</script>
