import { BasicTracerProvider, BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import * as metrics from '@opentelemetry/api-metrics';
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CompositePropagator, W3CTraceContextPropagator, W3CBaggagePropagator } from '@opentelemetry/core';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';

@Injectable()
export class Tracing implements OnModuleInit {

    private meterProvider: MeterProvider;

    onModuleInit() {
        if (!this.meterProvider) {
            this.init();
        }
    }

    private init(): void {

        // tracing
        const traceExporter = new OTLPTraceExporter({
            url: "http://localhost:4318/v1/traces"
        });

        const otelSDK = new NodeSDK({
            traceExporter: traceExporter,
            spanProcessor: new BatchSpanProcessor(traceExporter),
            contextManager: new AsyncLocalStorageContextManager(),
            textMapPropagator: new CompositePropagator({
                propagators: [
                    new W3CTraceContextPropagator(),
                    new W3CBaggagePropagator(),
                    new B3Propagator(),
                    new B3Propagator({
                        injectEncoding: B3InjectEncoding.MULTI_HEADER,
                    }),
                ],
            }),
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: "cusomer-service",
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
            url: 'http://localhost:4318/v1/metrics',
            concurrencyLimit: 10,
        };

        const metricExporter = new OTLPMetricExporter(collectorOptionsMetrics);
        this.meterProvider = new MeterProvider({});

        this.meterProvider.addMetricReader(new PeriodicExportingMetricReader({
            exporter: metricExporter,
            exportIntervalMillis: 1000,
        }));
    }

    public getMeter(name: string): metrics.Meter {
        if (!this.meterProvider) {
            this.init();
        }

        return this.meterProvider.getMeter(name);
    }
}