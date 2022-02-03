import { BaseEvent } from "src/common/events/base.event";
import { Address } from "src/domain/valueObjects/address.vo";

 export abstract class CustomerAddressBase extends BaseEvent {
    address: Address;
 }