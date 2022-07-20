import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { ApiMetricAccessor } from 'src/dal/api-repo/api-metric.accessor';
import { ApiMetric } from 'src/dal/api-repo/api-metric.schema';
import { ApiInvokeEvent } from './api.event';

@Injectable()
export class ApiMonitorService implements NestInterceptor {
	constructor(public readonly apiMetricAccessor: ApiMetricAccessor) { }
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const req = context.switchToHttp().getRequest();
		this.handleApiInvoked({ endpoint: req.route.path, apiKey: req.apiKey });

		return next.handle();
	}

	async handleApiInvoked(event: ApiInvokeEvent): Promise<any> {
		try {
			const metric: ApiMetric = {
				api_key: event.apiKey,
				endpoint: event.endpoint,
			};
			const result = await this.apiMetricAccessor.insert(metric);
			return result;
		} catch (error) {
			throw new Error(error);
		}
	}
}
