using Backoffice.Clients;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;
using System;

namespace Backoffice
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string customerUri = Environment.GetEnvironmentVariable("CUSTOMER_SERVICE_URI") ?? "http://localhost:3001";
            services.AddHttpClient(CustomerClient.KEY, client => {
                client.BaseAddress = new Uri(customerUri);
            });

            string paymentUri = Environment.GetEnvironmentVariable("PAYMENT_SERVICE_URI") ?? "http://payment.kube-test.acessobank-stg.com.br";
            services.AddHttpClient(TransactionClient.KEY, client => {
                client.BaseAddress = new Uri(paymentUri);
            });

            StartOpenTelemetry(services);

            services.AddSingleton<ICustomerClient, CustomerClient>();
            services.AddSingleton<ITransactionClient, TransactionClient>();

            services.AddControllersWithViews();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        private void StartOpenTelemetry(IServiceCollection services)
        {
            var serviceName = "Backoffice";
            var serviceVersion = "1.0.0";

            string uri = Environment.GetEnvironmentVariable("COLLECTOR_URI") ?? "http://localhost:4317";

            var isGrpcValue = Environment.GetEnvironmentVariable("IS_GRPC");
            bool isGrpc = true; // isGrpcValue == "YES" ? true : false;

            Console.WriteLine(uri);
            Console.WriteLine(isGrpc);

            services.AddOpenTelemetryMetrics(builder =>
            {
                builder.AddMeter(serviceName);
                builder.SetResourceBuilder(
                        ResourceBuilder.CreateDefault()
                            .AddService(serviceName: serviceName, serviceVersion: serviceVersion));

                builder.AddOtlpExporter(opt =>
                {
                    opt.Protocol = isGrpc ? OtlpExportProtocol.Grpc : OtlpExportProtocol.HttpProtobuf;
                    opt.Endpoint = new Uri(uri);

                });
            });


            services.AddOpenTelemetryTracing(tracerProviderBuilder =>
            {
                tracerProviderBuilder
                     .AddOtlpExporter(opt =>
                     {
                         opt.Protocol = isGrpc ? OtlpExportProtocol.Grpc : OtlpExportProtocol.HttpProtobuf;
                         opt.Endpoint = new Uri(uri);
                     })
                    .AddSource(serviceName)
                    .SetResourceBuilder(
                        ResourceBuilder.CreateDefault()
                            .AddService(serviceName: serviceName, serviceVersion: serviceVersion))
                    .AddHttpClientInstrumentation();

                tracerProviderBuilder.AddConsoleExporter();
            });
        }

    }
}
