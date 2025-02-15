export interface DatabaseService<T = any> {
  list(): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(object: T): Promise<T>;
  update(object: T, where: { id: string }): Promise<T>;
  delete(id: string): Promise<void>;
}
