// 全ての言語の「関係性」を返却
// selectで使うにはjpなどをいったんlabelに戻す必要あり
export const getRelationshipOptionsAllLang = () => [
  {
    jp: '直属の上司',
    en: 'Immediate Supervisor',
    cn: '直属上司',
    value: 'directSupervisor'
  }, {
    jp: '上司',
    en: 'Supervisor',
    cn: '上司',
    value: 'supervisor'
  }, {
    jp: '同僚',
    en: 'Colleagues',
    cn: '同僚',
    value: 'colleague'
  }, {
    jp: '直属の部下',
    en: 'Immediate subordinates',
    cn: '直属下属',
    value: 'directSubordinate'
  }, {
    jp: '部下',
    en: 'Subordinates',
    cn: '下属',
    value: 'subordinate'
  }, {
    jp: '顧客',
    en: 'Customer',
    cn: '顾客',
    value: 'customer'
  }, {
    jp: 'その他',
    en: 'Other',
    cn: '其他',
    value: 'other'
  }
]

// 指定された言語の「関係性」をgetRelationshipOptionsAllLangから絞り込み返却
// 言語未指定なら日本語の関係性を返す
export const getRelationshipOptionsByLang = (language = 'jp') => {
  return getRelationshipOptionsAllLang().map(option => {
    return {
      label: option[language],
      value: option.value
    }
  })
}

// 全ての言語の「働いていた時期」を返却
// selectで使うにはjpなどをいったんlabelに戻す必要あり
export const getTimeWorkingOptionsAllLang = () => [
  {
    jp: '現職',
    en: 'Current Job',
    cn: '当前工作',
    value: 'currentJub'
  }, {
    jp: '前職',
    en: 'Previous Job',
    cn: '以前的工作',
    value: 'previousJob'
  }, {
    jp: '前々職',
    en: 'Second Last Job',
    cn: '最后的第二份工作',
    value: 'secondLastJob'
  }, {
    jp: 'その他',
    en: 'Other',
    cn: '其他',
    value: 'other'
  }
]

// 指定された言語の「働いていた時期」をgetTimeWorkingOptionsAllLangから絞り込み返却
// 言語未指定なら日本語の関係性を返す
export const getTimeWorkingOptionsByLang = (language = 'jp') => {
  return getTimeWorkingOptionsAllLang().map(option => {
    return {
      label: option[language],
      value: option.value
    }
  })
}

// 全ての言語の「職業」を返却
// childrenは小選択肢（実際には大選択肢/小選択肢と表示される）
// cascaderで使うには大小のjpなどをいったんlabelに戻す必要あり
export const getJobCategoryOptionsAllLang = () => [
  {
    jp: '営業',
    en: 'Sales',
    cn: '营业',
    value: 'sales',
    children: [{
      jp: '法人営業（新規開拓）',
      en: 'Corporate sales (new business development)',
      cn: '企业销售（新业务开发）',
      value: 'corporateSales'
    }, {
      jp: '個人営業（新規開拓）',
      en: 'Personal Sales (New Development)',
      cn: '个人销售(新业务开发)',
      value: 'privateSales'
    }, {
      jp: 'ルートセールス・代理店営業',
      en: 'Route sales and agency sales',
      cn: '路线销售和代理销售',
      value: 'routeSales'
    }, {
      jp: '内勤営業・カウンターセールス',
      en: 'Inside Sales and Counter Sales',
      cn: '内部销售和柜台销售',
      value: 'counterSales'
    }, {
      jp: '海外営業',
      en: 'Overseas Sales',
      cn: '海外销售',
      value: 'overseasSales'
    }, {
      jp: 'カスタマーサービス・コールセンター運営',
      en: 'Customer Service Call Center Operations',
      cn: 'カスタマーサービス・コールセンター運営',
      value: 'customerService'
    }]
  }, {
    jp: '管理部門',
    en: 'Management Department',
    cn: '行政部门',
    value: 'managing',
    children: [{
      jp: '財務・経理',
      en: 'Finance and Accounting',
      cn: '财务和会计',
      value: 'finance'
    }, {
      jp: '人事',
      en: 'Human Resources',
      cn: '人力资源',
      value: 'personnel'
    }, {
      jp: '総務・事務',
      en: 'General Affairs and Administration',
      cn: '一般事务和行政',
      value: 'generalAffairs'
    }, {
      jp: '法務',
      en: 'Legal Affairs',
      cn: '法律事务',
      value: 'legalAffairs'
    }, {
      jp: '広報',
      en: 'Publicity',
      cn: '宣传',
      value: 'publicRelations'
    }, {
      jp: '物流・貿易',
      en: 'Logistics & Trade',
      cn: '物流与贸易',
      value: 'logistics'
    }, {
      jp: 'IR',
      en: 'IR',
      cn: '投资者关系',
      value: 'IR'
    }, {
      jp: '内部監査',
      en: 'Internal Audit',
      cn: '内部审计',
      value: 'internalAudit'
    }, {
      jp: 'コーポレート',
      en: 'Corporate',
      cn: '企业',
      value: 'corporate'
    }]
  }, {
    jp: 'マーケティング',
    en: 'Marketing',
    cn: '营销',
    value: 'marketing',
    children: [{
      jp: '商品企画',
      en: 'Product Planning',
      cn: '产品规划',
      value: 'productPlanning'
    }, {
      jp: 'ブランドマネージャー・プロジェクトマネージャー',
      en: 'Brand Manager/Project Manager',
      cn: '品牌和项目经理',
      value: 'brandManager'
    }, {
      jp: '広告・宣伝',
      en: 'Advertising and promotion',
      cn: '广告和促销',
      value: 'advertisement'
    }, {
      jp: '販売促進・販促企画',
      en: 'Sales promotion and sales promotion planning',
      cn: '销售促进和销售促进规划',
      value: 'salesPromotion'
    }, {
      jp: '営業企画',
      en: 'Sales Planning',
      cn: '销售计划',
      value: 'salesPlanning'
    }, {
      jp: 'イベント企画・運営',
      en: 'Event planning and management',
      cn: '活动规划和管理',
      value: 'eventPlanning'
    }, {
      jp: 'ダイレクトマーケティング',
      en: 'Direct Marketing',
      cn: '直销',
      value: 'directMarketing'
    }, {
      jp: 'Web・SNSマーケティング',
      en: 'Web and SNS Marketing',
      cn: '网络和SNS营销',
      value: 'webSnsMarketing'
    }, {
      jp: 'データアナリスト',
      en: 'Data Analyst',
      cn: '数据分析员',
      value: 'dataAnalyst'
    }, {
      jp: '市場調査・分析',
      en: 'Market Research and Analysis',
      cn: '市场研究和分析',
      label: 'marketResearch'
    }]
  }, {
    jp: '経営企画・経営戦略',
    en: 'Corporate Planning and Management Strategy',
    cn: '企业规划与经营战略',
    value: 'corporatePlanning',
    children: [{
      jp: '経営企画・事業統括',
      en: 'Corporate Planning and Business Management',
      cn: '企业规划和企业管理',
      value: 'businessManagement'
    }, {
      jp: '管理職・エグゼクティブ',
      en: 'Managers and Executives',
      cn: '经理和行政人员',
      value: 'management'
    }, {
      jp: 'MD・バイヤー・店舗開発・FCオーナー',
      en: 'MD, Buyer, Store Development and Franchise Owner',
      cn: 'MD、买手、店面开发和加盟店主。',
      value: 'MdBuyerStoreDevelopmentFCOwner'
    }]
  }, {
    jp: 'ディレクター',
    en: 'Director',
    cn: '导演',
    value: 'director',
    children: [{
      jp: 'Webディレクター・Webプロデューサー',
      en: 'Web Director and Web Producer',
      cn: '网站总监和网站制作人',
      value: 'webDirector'
    }, {
      jp: 'Webプランナー',
      en: 'Web Planner',
      cn: '网站规划师',
      value: 'webPlanner'
    }, {
      jp: 'テクニカルディレクター・プロジェクトマネージャー',
      en: 'Technical Director and Project Manager',
      cn: '技术总监和项目经理',
      value: 'technicalDirector'
    }, {
      jp: 'クリエイティブディレクター',
      en: 'Creative Director',
      cn: '创意总监',
      value: 'creativeDirector'
    }, {
      jp: '制作・進行管理（その他）',
      en: 'Production and progress management (and more)',
      cn: '生产和进度管理(及更多)',
      value: 'productionAssistant'
    }]
  }, {
    jp: 'ITエンジニア',
    en: 'IT Engineer',
    cn: 'IT工程师',
    value: 'ITEngineer',
    children: [{
      jp: '業務系アプリケーションエンジニア・プログラマ',
      en: 'Business Application Engineer/Programmer',
      cn: '业务应用工程师/程序员',
      value: 'businessApplicationEngineer'
    }, {
      jp: 'Webサービス系エンジニア・プログラマ',
      en: 'Web services engineers and programmers',
      cn: '网络服务工程师和程序员',
      value: 'webServiceEngineer'
    }, {
      jp: '制御系ソフトウェア開発（通信・ネットワーク・IoT関連）',
      en: 'Control system software development (related to communication, networking and IoT)',
      cn: '控制系统软件开发(通信、网络、物联网相关)',
      value: 'controlSystemSoftwareDevelopment'
    }, {
      jp: 'インフラエンジニア',
      en: 'Infrastructure Engineer',
      cn: '基础设施工程师',
      value: 'infrastructureEngineer'
    }, {
      jp: 'IT・システムコンサルタント',
      en: 'IT and Systems Consultants',
      cn: '信息技术和系统顾问',
      value: 'systemConsultant'
    }, {
      jp: '社内情報システム（社内SE）',
      en: 'In-house information systems (in-house SE)',
      cn: '内部信息系统（内部SE）',
      value: 'internalInformationSystem'
    }]
  }, {
    jp: 'クリエイター',
    en: 'Creators',
    cn: '创作者',
    value: 'creator',
    children: [{
      jp: 'Webデザイナー',
      en: 'Web Designer',
      cn: '网页设计师',
      value: 'webDesigner'
    }, {
      jp: 'UI・UXデザイナー',
      en: 'UI and UX Designer',
      cn: 'UI和用户体验设计师',
      value: 'UiUxDesigner'
    }, {
      jp: 'ゲームデザイナー・イラストレーター',
      en: 'Game designer and illustrator',
      cn: '游戏设计师和插画师',
      value: 'gameDesigner'
    }, {
      jp: 'CGデザイナー',
      en: 'CG Designer',
      cn: '平面设计师',
      value: 'CGDesigner'
    }, {
      jp: 'Web・モバイル・ソーシャル・ゲーム制作／開発',
      en: 'Web, Mobile and Social Game Creation/Development',
      cn: '网络/移动/社交游戏制作/开发',
      value: 'webMobileSocialGameDevelopment'
    }, {
      jp: 'Web編集',
      en: 'Web Editing',
      cn: '网络编辑',
      value: 'webEdit'
    }, {
      jp: 'Webライター',
      en: 'Web Writer',
      cn: '网络作家',
      value: 'webWriter'
    }]
  }, {
    jp: '専門職（コンサルタント 士業 金融 不動産）',
    en: 'Professions (consultant, professional industry, finance, real estate)',
    cn: '职业(顾问、专业、金融、房地产)',
    value: 'profession',
    children: [{
      jp: 'ビジネスコンサルタント・シンクタンク',
      en: 'Business Consultants and Think Tanks',
      cn: '商业顾问和智囊团',
      value: 'businessConsultant'
    }, {
      jp: '士業・専門コンサルタント',
      en: 'Professional and Specialized Consultants',
      cn: '专业和专门的顾问',
      value: 'professionalConsultant'
    }, {
      jp: '金融系専門職',
      en: 'Financial Professionals',
      cn: '金融专业人员',
      value: 'financialProfessional'
    }, {
      jp: '不動産・プロパティマネジメント系専門職',
      en: 'Real Estate and Property Management Professionals',
      cn: '房地产和财产管理专业人员',
      value: 'realEstateProfessional'
    }]
  }, {
    jp: 'サービス 接客 店舗',
    en: 'Service Customer Service Store',
    cn: '服务 客户服务 商店',
    value: 'service',
    children: [{
      jp: '店長・SV（スーパーバイザー）',
      en: 'Store Manager/SV (Supervisor)',
      cn: '店长/SV(主管)',
      value: 'storeManagerSv'
    }, {
      jp: 'ホールスタッフ・サービススタッフ',
      en: 'Hall staff and service staff',
      cn: '大厅工作人员和服务人员',
      value: 'hallStaffServiceStaff'
    }, {
      jp: '料理長',
      en: 'Head Chef',
      cn: '主厨',
      value: 'chef'
    }, {
      jp: '調理',
      en: 'Cooking',
      cn: '烹饪',
      value: 'cooking'
    }, {
      jp: '警備・清掃関連職',
      en: 'Security and cleaning related jobs',
      cn: '保安和清洁',
      value: 'Security/Cleaning'
    }]
  }, {
    jp: 'その他',
    en: 'Other',
    cn: '其他',
    value: 'other'
  }
]

// 指定された言語の「職業」をgetJobCategoryOptionsAllLangから絞り込み返却
// cascaderを使用しているためchildrenの内部もlabelに戻す必要があり，mapを二重で使うことで対応
// 言語未指定なら日本語の関係性を返す
export const getJobCategoryOptionsByLang = (language = 'jp') => {
  return getJobCategoryOptionsAllLang().map(option => {
    return {
      label: option[language],
      value: option.value,
      children: option.children?.map(child => {
        return {
          label: child[language],
          value: child.value
        }
      })
    }
  })
}

export const getAppliedSiteOptions = () => {
  const other = [
    { label: '人材紹介会社', value: 'agency' },
    { label: 'リファラル（社員紹介）採用', value: 'referrer' },
    { label: '自社HP', value: 'myHomepage' }
  ]

  const agents = [
    { label: 'マイナビ転職', value: 'mynavi' },
    { label: 'リクナビ', value: 'rikunavi' },
    { label: 'Type', value: 'type' },
    { label: 'doda', value: 'doda' },
    { label: 'エン転職', value: 'enTenshoku' },
    { label: 'Indeed', value: 'indeed' },
    { label: 'wantedly', value: 'wantedly' },
    { label: 'Pro seek', value: 'proSeek' },
    { label: 'Find Job!', value: 'findJob' },
    { label: 'イーキャリア', value: 'eCarrer' },
    { label: 'Re 就活', value: 'reShukatsu' },
    { label: 'バイトルNEXT', value: 'baitoruNext' },
    { label: 'ビジェント', value: 'bgent' },
    { label: 'アカリクWEB', value: 'akarikuWeb' },
    { label: 'サポーターズ', value: 'supporters' },
    { label: 'サーチ型新卒紹介', value: 'searchIntroduction' },
    { label: 'Career Select', value: 'carrerSelect' },
    { label: 'ASEAN CAREER', value: 'aseanCarrer' },
    { label: 'Wantedly Admin', value: 'wantedlyAdmin' },
    { label: 'BIZREACH', value: 'bizreach' },
    { label: 'キャリコネ転職', value: 'carikone' },
    { label: 'LiBzCAREER', value: 'liBzCarrer' },
    { label: '女の転職type', value: 'womenType' },
    { label: 'TechAcademyキャリア', value: 'techAcademyCarrer' },
    { label: 'キャリトレ', value: 'caritore' },
    { label: 'Linkedin', value: 'linkedin' },
    { label: 'TECH::CAMP', value: 'techCamp' },
    { label: 'paiza転職', value: 'paizaTensyoku' },
    { label: 'Workship', value: 'workship' },
    { label: 'Green', value: 'green' },
    { label: 'Forkwell', value: 'forkwell' },
    { label: 'PROsheet', value: 'proSheet' },
    { label: 'ITプロパートナーズ', value: 'itProPartners' },
    { label: 'ViViViT', value: 'vivivit' },
    { label: 'MOREWORKS', value: 'moreworks' },
    { label: 'InfrA', value: 'infra' },
    { label: 'キャリアバイト', value: 'carrerBaito' },
    { label: 'JEEK', value: 'jeek' },
    { label: 'スタンバイ・カンパニー', value: 'standbyCompany' },
    { label: '採用係長', value: 'saiyoKacho' },
    { label: 'キャリアクロス', value: 'carrerCross' },
    { label: 'Career Wake', value: 'carrerWake' },
    { label: 'TARGET', value: 'target' },
    { label: 'リクルート', value: 'recruit' },
    { label: 'パーソルキャリア', value: 'persolCareer' },
    { label: 'クリーク・アンド・リバー社', value: 'creekAndRiver' },
    { label: 'JAC Recruitment', value: 'jacRecruitment' },
    { label: 'シリコンスタジオ', value: 'siliconStudio' },
    { label: 'イマジカデジタルスケープ', value: 'imagicaDigitalscape' },
    { label: 'みんせつ', value: 'minsetsu' },
    { label: 'synca', value: 'synca' }
  ]

  return [...other, ...agents.sort((a, b) => (a.value < b.value ? -1 : 1))]
}

// element UIのcheckboxではlabelがそのまま値として扱われる
// 画面に表示するlabelとしてlabelToDisplayを用意
// （例）<el-checkbox :label="hoge.label">{{hoge.labelToDisplay}}</el-checkbox>
export const getReasonsForWithdrawalOptions = () => [
  {
    label: 'mistakeRegistration',
    labelToDisplay: '間違って登録した'
  }, {
    label: 'highCharge',
    labelToDisplay: '料金が高い'
  }, {
    label: 'badUsability',
    labelToDisplay: '使いづらい（操作性が悪い）'
  }, {
    label: 'badVisibility',
    labelToDisplay: '見づらい'
  }, {
    label: 'uglySystemDesign',
    labelToDisplay: 'システムデザインがダサい'
  }, {
    label: 'tooMuchWorkItemInput',
    labelToDisplay: '項目の入力が面倒臭い'
  }, {
    label: 'lowCredibility',
    labelToDisplay: '推薦者の意見の信憑性が低い'
  }, {
    label: 'lateAnswer',
    labelToDisplay: '推薦者の回答が遅い'
  }, {
    label: 'notClearManual',
    labelToDisplay: 'マニュアルが分かりづらい'
  }, {
    label: 'LowAccuracyOfCollectingInfomationOnAntisocialForcesCheck',
    labelToDisplay: '反社チェックの情報収集制度が低い'
  }, {
    label: 'badAntisocialForcesCheckUsability',
    labelToDisplay: '反社チェックが使いづらい'
  }, {
    label: 'badAntisocialForcesCheckVisibility',
    labelToDisplay: '反社チェックが見づらい'
  }, {
    label: 'other',
    labelToDisplay: 'その他'
  }
]

export const getAnswererRanks = () => [
  { label: 'fulltime', text: '一般職・責任者' },
  { label: 'rookie', text: '新卒・アルバイト' }
]

export const getQuestionsLangAllLang = () => [{
  jp: '日本語',
  en: 'Japanese',
  cn: '日文',
  value: 'jp'
}, {
  jp: '英語',
  en: 'English',
  cn: '英文',
  value: 'en'
}, {
  jp: '中国語',
  en: 'Chinese',
  cn: '中文',
  value: 'cn'
}]

// 指定された言語の「言語」をgetQuestionsLangAllLangから絞り込み返却
// 言語未指定なら日本語の関係性を返す
export const getQuestionsLangByLang = (language = 'jp') => {
  return getQuestionsLangAllLang().map(option => {
    return {
      label: option[language],
      value: option.value
    }
  })
}
