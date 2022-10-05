import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import * as metrics from '@opentelemetry/api-metrics';
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class Tracing implements OnModuleInit {

    private meterProvider: MeterProvider;

    onModuleInit() {
        if (!this.meterProvider) {
            this.init();
        }
    }

    private init(): void {

        const otlpEndpoint = process.env.OTLP_ENDPOINT ?? "http://localhost:4317";
        // tracing
        const traceExporter = new OTLPTraceExporter({
            url: `${otlpEndpoint}/v1/traces`
        });

        const otelSDK = new NodeSDK({
            traceExporter: traceExporter,
            spanProcessor: new BatchSpanProcessor(traceExporter),
            contextManager: new AsyncLocalStorageContextManager(),
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: "payments-service",
            }),
            instrumentations: [getNodeAutoInstrumentations()],
        });

        otelSDK
            .start()
            .then(() => {
                console.log("Tracing initialized");
            })
            .catch((error) => console.log("Error initializing tracing", error));

        // metrics
        const collectorOptionsMetrics = {
            url: `${otlpEndpoint}/v1/metrics`,
            concurrencyLimit: 10,
        };

        const metricExporter = new OTLPMetricExporter(collectorOptionsMetrics);
        this.meterProvider = new MeterProvider({});

        this.meterProvider.addMetricReader(new PeriodicExportingMetricReader({
            exporter: metricExporter,
            exportIntervalMillis: 1000,
        }));
        console.log(otlpEndpoint);
    }

    public getMeter(name: string): metrics.Meter {
        if (!this.meterProvider) {
            this.init();
        }

        return this.meterProvider.getMeter(name);
    }
}