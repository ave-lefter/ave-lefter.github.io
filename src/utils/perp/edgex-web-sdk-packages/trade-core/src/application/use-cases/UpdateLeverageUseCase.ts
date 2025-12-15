import { UpdateLeverageInput } from "../dtos/account.dto";
import { HttpAccountRepository } from "../../infrastructure/repositories/HttpAccountRepository";

export class UpdateLeverageUseCase {
  constructor(private readonly accountRepo: HttpAccountRepository) {}

  async execute(input: UpdateLeverageInput) {
    if (!input.accountId) {
      throw new Error("AccountId is required");
    }
    if (!input.contractId) {
      throw new Error("ContractId is required");
    }
    if (input.leverage <= 0) {
      throw new Error("Leverage must be greater than 0");
    }

    return this.accountRepo.updateLeverage(input);
  }
}
