using Antifraud.Commands;
using Antifraud.Consumers;
using Antifraud.Kafka;
using Antifraud.Mapping;
using Antifraud.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Antifraud.ExternalContracts;
using System;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;
using OpenTelemetry.Exporter;
using System.Diagnostics.Metrics;
using System.Diagnostics;

namespace Antifraud
{
    public class Startup
    {
        private string serviceName = "antifraud";
        private string serviceVersion = "1.0.0";
        private Meter _meter = new Meter("Antifraud", "1.0.0");
        private Counter<int> _counter;
        private ActivitySource activitySource;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            _counter = _meter.CreateCounter<int>("pix_was_analysed");
            activitySource = new ActivitySource(serviceName);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            

            services.AddSingleton(_meter);
            services.AddSingleton(_counter);
            services.AddSingleton(activitySource);

            StartOpenTelemetry(services);

            string kafkaConnection = Environment.GetEnvironmentVariable("KAFKA_BROKER") ?? "localhost:9092";
            string mongoConnection = Environment.GetEnvironmentVariable("MONGO_CONNECTION_STRING") ?? "mongodb://user:pwd@localhost:27017/admin";

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Antifraud", Version = "v1" });
            });

            services.AddConsumer<CustomerWasCreated, CustomerWasCreatedCunsumer>(
                new KafkaConsumerConfig
                {
                    GroupId = "antifraud-consumers",
                    ConnectionString = kafkaConnection,
                    TopicName = "customer_external_events",
                    EventName = "CUSTOMER_WAS_CREATED"
                });

            services.AddConsumer<CustomerWasUpdated, CustomerWasUpdatedCunsumer>(
                new KafkaConsumerConfig
                {
                    GroupId = "antifraud-consumers",
                    ConnectionString = kafkaConnection,
                    TopicName = "customer_external_events",
                    EventName = "CUSTOMER_WAS_UPDATED"
                });


            services.AddConsumerAnalysis<PixPaymentFraudAnalyzeCommand, PixPaymentFraudAnalyzeConsumer>(
              new KafkaConsumerConfigAnalysis
              {
                  GroupId = "pix-analysis",
                  ConnectionString = kafkaConnection,
                  TopicName = "pix_payment_fraud_analyse_request",
                  EventName = "pix_payment_fraud_analyse_request"
              });

            var client = new MongoClient(mongoConnection);
            services.AddSingleton((IMongoClient)client);
            services.AddSingleton<IMapper, Mapper>();
            services.AddSingleton<IKafkaProducer, KafkaProducer>();
            services.AddSingleton<ICustomerRepository, CustomerRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Antifraud v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private  void StartOpenTelemetry(IServiceCollection services)
        {
            string uri = Environment.GetEnvironmentVariable("COLLECTOR_URI") ?? "http://localhost:4317";

            var isGrpcValue = Environment.GetEnvironmentVariable("IS_GRPC");
            bool isGrpc = true; //isGrpcValue == "YES" ? true : false;

            Console.WriteLine(uri);
            Console.WriteLine(isGrpc);

            services.AddOpenTelemetryMetrics(builder =>
            {
                builder.AddMeter("Antifraud");
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
                    .AddHttpClientInstrumentation()
                    .AddAspNetCoreInstrumentation();

                tracerProviderBuilder.AddConsoleExporter();
            });
        }
    }
}
