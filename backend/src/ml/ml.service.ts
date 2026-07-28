import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export interface ClassifyTicketPayload {
  subject: string;
  description: string;
  customerEmail: string;
}

export interface ClassifyTicketResult {
  category?: string;
  priority?: string;
  confidence?: number;
  summary?: string;
  [key: string]: unknown;
}

interface MlServiceErrorResponse {
  detail?: string;
  message?: string;
}

@Injectable()
export class MlService {
  private readonly mlServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.mlServiceUrl =
      this.configService.get<string>('ML_SERVICE_URL') ||
      'http://127.0.0.1:8000';
  }


  async classifyTicket(
    payload: ClassifyTicketPayload,
  ): Promise<ClassifyTicketResult> {
    const requestBody: ClassifyTicketPayload = {
      subject: payload.subject,
      description: payload.description,
      customerEmail: payload.customerEmail,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<ClassifyTicketResult>(
          `${this.mlServiceUrl}/classify`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          },
        ),
      );

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<MlServiceErrorResponse>;

      const message =
        axiosError.response?.data?.detail ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        'ML service request failed';

      throw new BadGatewayException({
        message: 'Failed to classify ticket using ML service',
        mlServiceUrl: this.mlServiceUrl,
        endpoint: '/classify',
        cause: message,
      });
    }
  }
}
