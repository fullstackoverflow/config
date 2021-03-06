import { Config } from "./Config";

/**
 * Inject value from local config file
 *
 * @example
 * ```typescript
 * 
 * class Test{
 * 	@Value('param')
 * 	param:string;
 * }
 * ```
 * @param params
 */
export function Value(params: string): PropertyDecorator {
	return (target: any, propertyKey: string) => {
		const originDescriptor = Reflect.getOwnPropertyDescriptor((target && target.prototype) || target, propertyKey);
		const descriptor = originDescriptor || { configurable: true };
		descriptor.get = () => {
			return Config.instance[params];
		};
		Reflect.defineProperty(target, propertyKey, descriptor);
	};
}