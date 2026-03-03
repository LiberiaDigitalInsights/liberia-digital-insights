// Minimal mock API layer with small latency and localStorage persistence per collection
const KEY = (type) => `ldi_admin_${type}`;

export const api = {
  delay(ms = 150) {
    return new Promise((r) => setTimeout(r, ms));
  },
  getList(type) {
    try {
      const raw = localStorage.getItem(KEY(type));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  setList(type, arr) {
    try {
      localStorage.setItem(KEY(type), JSON.stringify(arr));
    } catch {
      /* empty */
    }
  },
  async list(type) {
    await this.delay();
    return this.getList(type);
  },
  initList(type, seed) {
    // Only seed when storage is empty
    const existing = this.getList(type);
    if (!existing || existing.length === 0) {
      this.setList(type, Array.isArray(seed) ? seed : []);
    }
  },
  async create(type, item) {
    await this.delay();
    const list = this.getList(type);
    const withId = { ...item, id: item.id ?? Date.now() };
    this.setList(type, [withId, ...list]);
    return withId;
  },
  async update(type, item) {
    await this.delay();
    const list = this.getList(type);
    const updated = list.map((x) => (x.id === item.id ? { ...x, ...item } : x));
    this.setList(type, updated);
    return item;
  },
  async remove(type, id) {
    await this.delay();
    const list = this.getList(type);
    const next = list.filter((x) => x.id !== id);
    this.setList(type, next);
    return { ok: true };
  },
  async toggle(type, id, next) {
    await this.delay();
    const list = this.getList(type);
    const updated = list.map((x) => (x.id === id ? { ...x, ...next } : x));
    this.setList(type, updated);
    return { id, ...next };
  },
};
