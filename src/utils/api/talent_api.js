import { functions } from '@/plugins/firebase'
import { Converter } from './converter'

export const TalentApi = ({ companyId, talentId }) => ({
  /**
   * @return {Promise<{companyName: string, talentData: TalentData, refereesData: RefereeData[]}>}
   */
  async get() {
    const { data } = await functions.httpsCallable('getTalentByIds')({
      companyId,
      talentId
    })
    return {
      ...data,
      talentData: Converter.decodeTalentDateFields(data.talentData),
      // `map(Converter.decodeRefereeDateFilelds)`だとthisがundefinedになるためこうする
      refereesData: data.refereesData.map(referee => Converter.decodeRefereeDateFields(referee))
    }
  },

  /**
   * @param {object} data
   * @param {string} data.companyId
   * @param {string} data.talentId
   * @param {object} data.data talentドキュメントのフィールド
   */
  async update(data) {
    return functions.httpsCallable('updateTalentByIds')({
      companyId,
      talentId,
      data: Converter.encodeDateFields(data)
    })
  }
})
