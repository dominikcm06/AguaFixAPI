import { CreateReportDto } from '../dtos/create-report.dto';

const SEVERITY_LABELS: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

const SEVERITY_COLORS: Record<string, string> = {
  low: '#2e7d32',
  medium: '#e6a700',
  high: '#c62828',
};

const row = (label: string, value: string) => `
              <tr>
                <td style="padding:14px 0;border-bottom:1px solid #dbe9f5;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:18px;color:#5b7691;text-transform:uppercase;letter-spacing:.6px;">${label}</td>
                <td align="right" style="padding:14px 0;border-bottom:1px solid #dbe9f5;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:22px;color:#0d2b45;font-weight:bold;">${value}</td>
              </tr>`;

export const generateReportTemplate = (dto: CreateReportDto): string => {
  const { address, description, severity, reporterPhone } = dto;
  const severityLabel = SEVERITY_LABELS[severity] ?? severity;
  const severityColor = SEVERITY_COLORS[severity] ?? '#0d2b45';

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Nueva fuga de agua reportada</title>
  </head>
  <body style="margin:0;padding:0;background-color:#eef4fa;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef4fa;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(13,43,69,.08);">

            <!-- Header -->
            <tr>
              <td style="background-color:#0d63b3;padding:32px 32px 28px 32px;">
                <p style="margin:0 0 10px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:16px;letter-spacing:1.4px;text-transform:uppercase;color:#aed6f7;">AguaFix &middot; Alerta</p>
                <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:26px;line-height:32px;color:#ffffff;font-weight:bold;">Se reporto una fuga de agua</h1>
                <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:22px;color:#d9edfb;">Un ciudadano reporto una fuga en la via publica. Se requiere atencion de la cuadrilla de mantenimiento.</p>
              </td>
            </tr>

            <!-- Severidad -->
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background-color:${severityColor};border-radius:999px;padding:8px 18px;">
                      <span style="font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:.6px;text-transform:uppercase;color:#ffffff;">Severidad: ${severityLabel}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Detalles -->
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <h2 style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;letter-spacing:1px;text-transform:uppercase;color:#0d63b3;">Datos del reporte</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row('Direccion', address)}
${row('Descripcion', description)}
${row('Telefono de contacto', reporterPhone)}
                </table>
              </td>
            </tr>

            <!-- Contacto -->
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eaf3fb;border-radius:12px;">
                  <tr>
                    <td align="center" style="padding:24px;">
                      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:18px;letter-spacing:.6px;text-transform:uppercase;color:#4c7597;">Contacto del reportante</p>
                      <p style="margin:0 0 18px 0;font-family:Helvetica,Arial,sans-serif;font-size:24px;line-height:30px;color:#0d2b45;font-weight:bold;">${reporterPhone}</p>
                      <a href="tel:${reporterPhone}" style="display:inline-block;background-color:#0d63b3;color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:20px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:999px;">Llamar ahora</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#7d95ab;text-align:center;">Recibiste este correo porque formas parte de la cuadrilla de mantenimiento de AguaFix.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
