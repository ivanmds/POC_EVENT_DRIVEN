using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Exporter;
using OpenTelemetry.Logs;
using OpenTelemetry.Resources;

namespace Backoffice
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                }).ConfigureLogging((HostBuilderContext context, ILoggingBuilder configureLogging) =>
                {
                    configureLogging.AddOpenTelemetry((OpenTelemetryLoggerOptions loggingbuilder) =>
                    {
                        var serviceName = "Backoffice";
                        var serviceVersion = "1.0.0";

                        loggingbuilder.AddOtlpExporter(opt =>
                        {
                            string uri = Environment.GetEnvironmentVariable("COLLECTOR_URI") ?? "http://localhost:4318";

                            var isGrpcValue = Environment.GetEnvironmentVariable("IS_GRPC");
                            bool isGrpc = isGrpcValue == "YES" ? true : false;

                            opt.Protocol = isGrpc ? OtlpExportProtocol.Grpc : OtlpExportProtocol.HttpProtobuf;
                            opt.Endpoint = new Uri(uri);

                        }).SetResourceBuilder(
                            ResourceBuilder.CreateDefault()
                                .AddService(serviceName: serviceName, serviceVersion: serviceVersion));
                    });
                });
    }
}
