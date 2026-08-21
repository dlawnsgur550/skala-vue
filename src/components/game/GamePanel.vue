<template>
  <section class="game-panel">
    <header v-if="$slots.header" class="game-panel__header">
      <slot name="header"></slot>
    </header>

    <div class="game-panel__content">
      <slot></slot>
    </div>

    <footer v-if="$slots.footer" class="game-panel__footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<style scoped>
.game-panel {
  position: relative;
  overflow: hidden;
  color: var(--game-text, #f5f0d0);
  background: var(--game-panel, #26374a);
  border: 4px solid var(--game-border-dark, #17212d);
  box-shadow:
    inset 0 0 0 3px var(--game-border-light, #6f8290),
    7px 7px 0 rgb(10 18 25 / 35%);
}

.game-panel::after {
  position: absolute;
  inset: 6px;
  border: 1px dashed rgb(255 255 255 / 12%);
  content: '';
  pointer-events: none;
}

.game-panel__header,
.game-panel__footer {
  position: relative;
  z-index: 1;
  padding: 12px 16px;
  background: var(--game-panel-strong, #1c2b3a);
}

.game-panel__header {
  border-bottom: 3px solid var(--game-border-dark, #17212d);
}

.game-panel__footer {
  border-top: 3px solid var(--game-border-dark, #17212d);
}

.game-panel__content {
  position: relative;
  z-index: 1;
}
</style>
