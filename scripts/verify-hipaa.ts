import { encryptPHI, decryptPHI } from '../src/lib/encryption';
import { auditLogger } from '../src/lib/audit';

console.log('--- Running HIPAA Encryption & Audit Logging Verification ---');

// 1. Test Envelope Encryption
const phiData = 'Patient: John Doe, DOB: 1980-05-12, Diagnosis: Hypertension, SSN: 000-00-0000';
console.log('Original PHI:', phiData);

const encrypted = encryptPHI(phiData);
console.log('Encrypted Envelope generated successfully:', {
  ciphertextLength: encrypted.ciphertext.length,
  encryptedDEKLength: encrypted.encryptedDEK.length,
  iv: encrypted.iv,
});

const decrypted = decryptPHI(encrypted);
console.log('Decrypted PHI:', decrypted);

if (decrypted !== phiData) {
  console.error('ERROR: Decrypted PHI does not match original!');
  process.exit(1);
}
console.log('Encryption & Decryption test PASSED.');

// 2. Test SHA-256 Hash-Chained Audit Logging
console.log('\nTesting Audit Log Hash Chaining...');
auditLogger.log('Dr. Smith', 'PHI_ACCESS', 'patient-123', { reason: 'Annual checkup' });
auditLogger.log('Dr. Smith', 'PHI_UPDATE', 'patient-123', { field: 'medication' });
auditLogger.log('Nurse Jackie', 'PHI_READ', 'patient-456', { reason: 'Vitals intake' });

const logs = auditLogger.getLogs();
console.log(`Recorded ${logs.length} audit logs.`);
logs.forEach((log, index) => {
  console.log(`[${index}] Action: ${log.action} | Actor: ${log.actor} | Hash: ${log.hash.substring(0, 12)}... | PrevHash: ${log.previousHash.substring(0, 12)}...`);
});

const isValidInitial = auditLogger.verifyChain();
console.log('Audit chain verification status:', isValidInitial ? 'VALID' : 'INVALID');

if (!isValidInitial) {
  console.error('ERROR: Initial audit chain validation failed!');
  process.exit(1);
}

// 3. Test Tamper Detection
console.log('\nTesting Tamper Detection...');
// Tamper with log[1] details
(logs[1] as any).details = { field: 'unauthorized_tampering' };

const isValidTampered = auditLogger.verifyChain();
console.log('Audit chain verification after tampering:', isValidTampered ? 'VALID (FAILED TEST)' : 'INVALID (CORRECTLY DETECTED)');

if (isValidTampered) {
  console.error('ERROR: Tamper detection failed to catch modified audit log!');
  process.exit(1);
}

console.log('\nAll HIPAA Audit Logging & Encryption verifications PASSED successfully!');
