<template>
  <Container hidden-header>
    <InteractiveForm />
  </Container>
</template>

<script lang="ts" setup>
import InteractiveForm from "./interactive-form.vue";
import Container from "@/components/container/index.vue";
</script>

<style lang="scss">
.nut-steps {
  overflow: auto;
  padding: 24rpx 0;

  .nut-step {
    min-width: 200rpx;
  }
}
</style>
