using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;
using OpenTelemetry.Exporter;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Logs;
using System;

namespace Antifraud
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
                        var serviceName = "antifraud";
                        var serviceVersion = "1.0.0";

                        loggingbuilder.AddOtlpExporter(opt =>
                        {
                            string uri = Environment.GetEnvironmentVariable("COLLECTOR_URI") ?? "http://localhost:4317";

                            var isGrpcValue = Environment.GetEnvironmentVariable("IS_GRPC");
                            bool isGrpc = true; //isGrpcValue == "YES" ? true : false;

                            opt.Protocol = isGrpc ? OtlpExportProtocol.Grpc : OtlpExportProtocol.HttpProtobuf;
                            opt.Endpoint = new Uri(uri);

                        }).SetResourceBuilder(
                            ResourceBuilder.CreateDefault()
                                .AddService(serviceName: serviceName, serviceVersion: serviceVersion));
                    });
                });
    }
}
