<template>
  <div>
    <h3>指定した推薦者内訳</h3>
    <div v-for="(breakdown, i) in refereeBreakdowns" :key="i">
      関係性 :
      <span v-if="breakdown.relationship === 'other'">{{ breakdown.otherRelationship }}</span>
      <span v-else-if="breakdown.relationship">
        {{ options.relationshipOptions.find(elem => elem.value === breakdown.relationship).label }}
      </span>
      <span v-else>指定なし</span><br>
      一緒に働いた時期 :
      <span v-if="breakdown.timeWorkingTogether === 'other'">{{ breakdown.otherTimeWorkingTogether }}</span>
      <span v-else-if="breakdown.timeWorkingTogether">
        {{ options.timeWorkingOptions.find(elem => elem.value === breakdown.timeWorkingTogether).label }}
      </span>
      <span v-else>指定なし</span>
      <p>{{ breakdown.numberOfPeople }}名</p>
      <hr>
    </div>
    <h3>リファレンスチェック推薦者一覧</h3>
    <el-table v-loading="loading" :data="referees" style="margin-bottom: 1rem; pointer-events: none;" :row-style="tableRowStyle">
      <el-table-column label="氏名" prop="name" />
      <el-table-column label="所属" prop="belongs" />
      <el-table-column label="メールアドレス" prop="email" />
      <el-table-column label="電話番号" prop="phoneNumber" />
      <el-table-column label="[時期]関係性">
        <template slot-scope="{row}">
          <span v-if="row.relationship === 'other'">
            [{{ row.otherTimeWorkingTogether }}]
            {{ row.otherRelationship }}
          </span>
          <span v-else>
            [{{ get(options.timeWorkingOptions.find(elem => elem.value === row.timeWorkingTogether), 'label') }}]
            {{ get(options.relationshipOptions.find(elem => elem.value === row.relationship), 'label') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="証明画像">
        <template v-if="row.businessCardUrl" slot-scope="{row}">
          <a :href="row.businessCardUrl" target="_blank" style="pointer-events: auto;">
            <el-button type="success" size="mini">
              画像リンク
            </el-button>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="回答状況" align="center">
        <template slot-scope="{row}">
          <span v-if="row.completedAt">完了</span>
          <span v-else-if="row.answer">途中</span>
          <span v-else>未回答</span>
        </template>
      </el-table-column>
    </el-table>
    <guide-grid />
  </div>
</template>

<script>
import GuideGrid from '@/components/GuideGrid'
import get from 'lodash/get'
import { getRelationshipOptionsByLang, getTimeWorkingOptionsByLang } from '@/constants/options'

export default {
  name: 'RefereeList',
  components: { GuideGrid },
  props: {
    loading: { type: Boolean, default: false },
    refereeBreakdowns: {
      type: Array,
      default: () => {
        [{ numberOfPeople: null, relationship: '', otherRelationship: '', timeWorkingTogether: '', otherTimeWorkingTogether: '' }]
      }
    },
    referees: {
      type: Array,
      default: () => {
        [{ name: '', email: '', belongs: '', relationship: '', businessCardUrl: '', completedAt: '' }]
      }
    }
  },
  data() {
    return {
      options: {
        relationshipOptions: getRelationshipOptionsByLang(),
        timeWorkingOptions: getTimeWorkingOptionsByLang()
      }
    }
  },
  methods: {
    get,
    tableRowStyle({ row }) {
      // 回答を終えている
      if (row.completedAt) {
        return {
          'background-color': 'rgb(240, 249, 235)',
          'color': '#67C23A'
        }
      // 1問は回答している
      } else if (row.answer) {
        return {
          'background-color': 'rgb(255, 255, 224)',
          'color': '#E3BF49'
        }
      }
      // 回答していない
      return {
        'background-color': 'rgb(253, 226, 226)',
        'color': '#F56C6C'
      }
    }
  }
}
</script>
