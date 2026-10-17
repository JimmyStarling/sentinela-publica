import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * Traduz erros do Postgres em respostas HTTP claras, sem expor detalhes internos.
 * 23505 = violação de unicidade; 23503 = violação de chave estrangeira.
 */
@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const code = (exception as { driverError?: { code?: string } }).driverError?.code;

    if (code === '23505') {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Já existe um registro com esses dados',
        error: 'Conflict',
      });
    }
    if (code === '23503') {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Operação não permitida: existem registros relacionados',
        error: 'Conflict',
      });
    }

    // Erro inesperado: registra só código e mensagem (sem query nem parâmetros).
    this.logger.error(`Erro de banco (${code ?? 'sem código'}): ${exception.message}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}