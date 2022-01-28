export const environment = {

    fileName: () => ".env",
    applicationName: 'customer',
    topics: {
        customer_events: 'customer_events',
        numberPartition: parseInt(process.env.KAFKA_NUMBER_PARTITION)
    }
}