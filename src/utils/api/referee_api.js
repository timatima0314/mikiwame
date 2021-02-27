import { functions } from '@/plugins/firebase'
import { Converter } from './converter'

export const RefereeApi = ({ companyId, talentId, refereeId = null }) => ({
  async get() {
    const { data } = await functions.httpsCallable('getRefereeByIds')({ companyId, talentId, refereeId })
    return {
      ...data,
      deadline: new Date(data.deadline),
      refereeData: Converter.decodeRefereeDateFields(data.refereeData)
    }
  },

  /**
   * @param {RefereeData[]} referees
   * @returns {Promise<string[]>} 追加したドキュメントのIDの配列
   */
  async add(referees) {
    return functions.httpsCallable('addRefereesByIds')({
      companyId,
      talentId,
      referees: referees.map(Converter.encodeDateFields)
    }).then(res => res.data)
  },

  /**
   * referee単体を更新する
   * @param {*} data
   */
  async update(data) {
    return this.updateAll([{ ...data, id: refereeId }])
  },

  /**
   * @param {RefereeData[]} referees 更新したいrefereeのデータの配列。idフィールドを含めること。
   * @returns {Promise<[]>}
   */
  async updateAll(referees) {
    return functions.httpsCallable('updateRefereesByIds')({
      companyId,
      talentId,
      referees: referees.map(Converter.encodeDateFields)
    }).then(res => res.data)
  },

  /**
   * @param {string[]} refereeIds 削除したいrefereeのidの配列
   * @returns {Promise<[]>}
   */
  async delete(refereeIds) {
    return functions.httpsCallable('deleteRefereesByIds')({
      companyId,
      talentId,
      refereeIds
    }).then(res => res.data)
  }
})
