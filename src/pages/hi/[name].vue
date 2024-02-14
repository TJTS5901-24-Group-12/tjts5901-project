<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-pedestrian inline-block />
    </div>

    <p text-sm opacity-75>
      <em>{{ t('intro.dynamic-route') }}</em>
    </p>

    <div>
      <button
        m="3 t6" text-sm btn
        @click="router.back()"
      >
        {{ t('button.back') }}
      </button>
    </div>
  </div>
</template>
