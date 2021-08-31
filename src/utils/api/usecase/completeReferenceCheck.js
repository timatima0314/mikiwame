// @ts-check
import { functions } from '@/plugins/firebase'

/**
 * @param {import('./type').RegisterReferenceCheckArgs} args
 */
export async function completeReferenceCheck(args) {
  await functions.httpsCallable('completeReferenceCheck')({
    companyId: args.companyId,
    talentId: args.talentId,
    refereeId: args.refereeId,
    uid: args.uid
  })
}

