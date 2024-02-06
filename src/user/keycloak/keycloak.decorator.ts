export function Authenticated(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      if (error.response?.status === 401) {
        await this.auth();
        return await originalMethod.apply(this, args);
      }
      throw error;
    }
  };
}
