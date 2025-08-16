import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
} from "@solana/spl-token";
import { TOKEN_CONSTANTS } from "@/constants/token";

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

/**
 * Send SOL to admin wallet
 */
export const sendSolToAdmin = async (
  connection: Connection,
  fromPublicKey: PublicKey,
  amount: number, // Amount in SOL
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<TransactionResult> => {
  try {
    const adminWallet = new PublicKey(TOKEN_CONSTANTS.ADMIN_WALLET_ADDRESS);
    const amountInLamports = amount * LAMPORTS_PER_SOL;

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: adminWallet,
        lamports: amountInLamports,
      })
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPublicKey;

    // Sign and send transaction
    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    // Confirm transaction
    await connection.confirmTransaction(signature, "confirmed");

    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error("Error sending SOL to admin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Send LLC tokens to admin wallet
 */
export const sendLLCToAdmin = async (
  connection: Connection,
  fromPublicKey: PublicKey,
  amount: number, // Amount in LLC tokens
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<TransactionResult> => {
  try {
    const adminWallet = new PublicKey(TOKEN_CONSTANTS.ADMIN_WALLET_ADDRESS);
    const tokenMint = new PublicKey(TOKEN_CONSTANTS.MINT_ADDRESS);

    // Get associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      fromPublicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const adminTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      adminWallet,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Convert amount to token decimals
    const amountInSmallestUnit =
      amount * Math.pow(10, TOKEN_CONSTANTS.TOKEN_DECIMALS);

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      adminTokenAccount,
      fromPublicKey,
      amountInSmallestUnit
    );

    // Create transaction
    const transaction = new Transaction().add(transferInstruction);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPublicKey;

    // Sign and send transaction
    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    // Confirm transaction
    await connection.confirmTransaction(signature, "confirmed");

    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error("Error sending LLC to admin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Check if user has enough SOL balance
 */
export const checkSolBalance = async (
  connection: Connection,
  publicKey: PublicKey,
  requiredAmount: number // Amount in SOL
): Promise<boolean> => {
  try {
    const balance = await connection.getBalance(publicKey);
    const requiredLamports = requiredAmount * LAMPORTS_PER_SOL;
    return balance >= requiredLamports;
  } catch (error) {
    console.error("Error checking SOL balance:", error);
    return false;
  }
};

/**
 * Check if user has enough LLC token balance
 */
export const checkLLCBalance = async (
  connection: Connection,
  publicKey: PublicKey,
  requiredAmount: number // Amount in LLC tokens
): Promise<boolean> => {
  try {
    const tokenMint = new PublicKey(TOKEN_CONSTANTS.MINT_ADDRESS);
    const tokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const accountInfo = await getAccount(connection, tokenAccount);
    if (!accountInfo) return false;

    const requiredAmountInSmallestUnit =
      requiredAmount * Math.pow(10, TOKEN_CONSTANTS.TOKEN_DECIMALS);
    return Number(accountInfo.amount) >= requiredAmountInSmallestUnit;
  } catch (error) {
    console.error("Error checking LLC balance:", error);
    return false;
  }
};
