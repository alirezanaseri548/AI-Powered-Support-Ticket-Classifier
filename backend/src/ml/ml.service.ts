import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClassifyTicketDto } from './dto/classify-ticket.dto';

export type MlCategory = 'BILLING' | 'TECHNICAL' | 'ACCOUNT' | 'GENERAL';
export type MlPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface MlClassificationResult {
  category: MlCategory;
  priority: MlPriority;
  confidence: number;
}

@Injectable()
export class MlService {
  private readonly mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

  constructor(private readonly httpService: HttpService) {}

  async classifyTicket(payload: ClassifyTicketDto): Promise<MlClassificationResult> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<MlClassificationResult>(
          `${this.mlServiceUrl}/classify`,
          payload,
          {
            timeout: 5000,
          },
        ),
      );

      return response.data;
    } catch {
      throw new ServiceUnavailableException('ML service is not available');
    }
  }
}
