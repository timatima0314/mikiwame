import Vue from 'vue'
import VueI18n from 'vue-i18n'

const messages = {
  referee: {
    jp: {
      message: {
        questionnaire: 'アンケート',
        personalInformationHandlingConsent: '個人情報取り扱いの同意',
        spPersonalInformationHandlingConsent: '同意',
        phoneNumberVerification: '電話番号認証',
        spPhoneNumberVerification: '認証',
        identification: '本人確認',
        referenceCheckCompleted: 'リファレンスチェック完了',
        spReferenceCheckCompleted: '完了',
        instructionTitle: '{honorific}のリファレンス提供のお願い',
        personalRegistration: '本人情報登録',
        personalRegistrationText: '推薦者様ご本人の情報を登録していただきます。',
        questionnaireResponses: 'アンケート回答',
        questionnaireResponsesText: '候補者様に関するアンケートにお答えいただきます。',
        personalConfirmation: '本人確認',
        personalConfirmationText: '推薦者様のご本人確認のため、名刺もしくは電話番号をご登録いただきます。',
        referenceCollectionDeadline: 'リファレンス回収期日',
        timeForReferences: '推薦者様の回答時間の目安',
        requestForDescriptions: '記述式の質問にお答えいただきます。{honorific} の職場での様子をお答えください。',
        requestForSelections: '選択式の質問にお答えいただきます。{honorific} の職場での様子をお答えください。',
        descriptionQuestions: '記述式の問題',
        pleaseFillOut: '記入してください',
        returnToDescriptionQuestions: '記述式の質問に戻る',
        selectionQuestions: '選択式の質問',
        numberOfQuestions: '{number}問',
        pleaseSelect: '選択してください',
        pleaseAnswerAll: '未回答の質問があります。全ての質問に回答してください。',
        savedAnswer: '回答を保存しました',
        pleaseUploadBusinessCards: '本人確認のために、名刺が2枚並んでいる写真をアップロードしていただきます。',
        pleasePreventIdentityTheft: 'なりすまし防止にご協力ください。名刺アップロード後、リファレンスチェックが完了となります。',
        yourNameOnTheFront: '2枚とも氏名が記載されている面を表にして撮影してください。',
        uploadPicture: '写真アップロード',
        notSelected: '選択されていません',
        registerAndContinue: '登録して次へ',
        thankYouReferenceCheck: 'リファレンスチェックへのご協力ありがとうございました',
        informationKeptInStrictConfidence: 'ご回答頂きました情報は厳重に管理させていただきます。',
        failedToLoadPhoto: '写真の読み込みに失敗しました。通信環境を確認したうえで再度お試しください。',
        failedToUploadBusinessCard: '名刺のアップロードに失敗しました。通信環境を確認したうえで再度お試しください。',
        deadlinePassed: '回答期限が過ぎています。',
        modifyYourAnswer: '回答を修正する',
        uploadedBusinessCard: '名刺をアップロードしました',
        registeringPhoneNumber: '電話番号の登録',
        toIncreaseSecurity: 'セキュリティを高めるため',
        pleaseRegisteringPhoneNumber: '電話番号の登録をお願いします。',
        canReceiveSMS: 'SMSを受信できる電話番号をご入力ください',
        sendCode: '認証コードを送る',
        codeHasBeenSent: '{phoneNumber}に認証コードを送信しました',
        reEnterNumber: '電話番号を入力し直す',
        authenticationCode: '認証コード',
        invalidNumber: '電話番号の形式が無効です',
        numberIsAlreadyRegistered: 'その電話番号は既に他のアカウントで登録されています',
        successfullyVerified: '電話番号の認証に成功しました',
        wrongAuthorizationCode: '認証コードが違います',
        onceYouHaveCompleted: '※一度回答を完了すると再度編集は行えません',
        doYouCompleted: '回答を完了しますか？',
        messageAndURLForReferee: '{honorific}より、リファレンスチェックの回答依頼が届いております。こちらのURLをクリックして頂きご回答をよろしくお願いいたします。'
      }
    },
    en: {
      // 仮
      message: {
        questionnaire: 'Questionnaire',
        personalInformationHandlingConsent: 'Personal Information Handling Consent',
        spPersonalInformationHandlingConsent: 'Consent',
        phoneNumberVerification: 'Phone Number Verification',
        spPhoneNumberVerification: 'Verification',
        identification: 'Identification',
        referenceCheckCompleted: 'Reference Check Completed',
        spReferenceCheckCompleted: 'Complete',
        instructionTitle: 'Request for reference for {honorific}',
        personalRegistration: 'Registration of personal information',
        personalRegistrationText: 'You will be asked to register your personal information.',
        questionnaireResponses: 'Take a Survey',
        questionnaireResponsesText: 'You will be asked to fill out a questionnaire about your candidate.',
        personalConfirmation: 'Identity Verification',
        personalConfirmationText: 'You will be asked to register your business card or phone number to confirm your identity.',
        referenceCollectionDeadline: 'Reference collection deadline',
        timeForReferences: 'Estimated response time for your references',
        requestForDescriptions: 'You will be asked to answer a descriptive question. Please tell us how {honorific} is doing at his workplace.',
        requestForSelections: 'You will be asked to answer a selective question. Please tell us how {honorific} is doing at his workplace.',
        descriptionQuestions: 'Descriptive questions',
        pleaseFillOut: 'Please fill out',
        returnToDescriptionQuestions: 'Return to descriptive questions',
        selectionQuestions: 'Selective questions',
        numberOfQuestions: '{number} questions',
        pleaseSelect: 'Please select',
        pleaseAnswerAll: 'There are unanswered questions. Please answer all questions.',
        savedAnswer: 'Saved answer',
        pleaseUploadBusinessCards: 'You will be asked to upload a photo of two business cards side by side to confirm your identity.',
        pleasePreventIdentityTheft: 'It helps us to prevent identity theft. After you upload your business cards, the reference check will be completed.',
        yourNameOnTheFront: 'Both photos must be taken with the side with your name on them facing up.',
        uploadPicture: 'Photo Upload',
        notSelected: 'Not selected',
        registerAndContinue: 'Register and Next',
        thankYouReferenceCheck: 'Thank you for your participation in the reference check.',
        informationKeptInStrictConfidence: 'The information you provide will be held in strict confidence.',
        failedToLoadPhoto: 'Failed to load the photo. Please give it some time and try again.',
        failedToUploadBusinessCard: 'Failed to upload a business card. Please give it some time and try again.',
        deadlinePassed: 'The deadline for response has passed.',
        modifyYourAnswer: 'Modify your answer',
        uploadedBusinessCard: 'Uploaded business card',
        registeringPhoneNumber: 'Registering a phone number',
        toIncreaseSecurity: 'To increase security',
        pleaseRegisteringPhoneNumber: 'Please register your phone number.',
        canReceiveSMS: 'Please enter a phone number where you can receive SMS.',
        sendCode: 'Send authentication code',
        codeHasBeenSent: 'Authentication code has been sent to {phoneNumber}',
        reEnterNumber: 'Re-enter your phone number.',
        authenticationCode: 'Authentication code',
        invalidNumber: 'Invalid phone number format.',
        numberIsAlreadyRegistered: 'The phone number is already registered in another account.',
        successfullyVerified: 'Phone number has been successfully verified.',
        wrongAuthorizationCode: 'Wrong authorization code.',
        onceYouHaveCompleted: '※Once you have completed your answer, you will not be able to edit it again.',
        doYouCompleted: 'Do you want to complete your answer?',
        messageAndURLForReferee: 'We have received a request from {honorific} for a reference check response. Please click on this URL and send us your answer.'
      }
    },
    cn: {
      // 仮
      message: {
        questionnaire: '问卷调查',
        personalInformationHandlingConsent: '个人信息处理同意书',
        spPersonalInformationHandlingConsent: '赞同',
        phoneNumberVerification: '电话号码验证',
        spPhoneNumberVerification: '电话号码验证',
        identification: '识别',
        referenceCheckCompleted: '完成背景调查',
        spReferenceCheckCompleted: '完成',
        instructionTitle: '{honorific}的背景調查聯絡的提供',
        personalRegistration: '註冊個人情報',
        personalRegistrationText: '登記推薦者的情報。',
        questionnaireResponses: '問卷回答',
        questionnaireResponsesText: '請告知關於候選者事宜的問卷。',
        personalConfirmation: '本人確認',
        personalConfirmationText: '為了確認推薦者是屬本人，請登記電話號碼或是名片資訊。',
        referenceCollectionDeadline: '收集参考资料的截止日期',
        timeForReferences: '被提名人的估计答复时间',
        requestForDescriptions: '请回答描述性问题，并告诉我们 {honorific} 的工作情况。',
        requestForSelections: '请回答选择性问题，并告诉我们 {honorific} 的工作情况。',
        descriptionQuestions: '描述性问题',
        pleaseFillOut: '进入。',
        returnToDescriptionQuestions: '返回到描述性问题',
        selectionQuestions: '选择性问题',
        numberOfQuestions: '{number}个问题',
        pleaseSelect: '请选择一个。',
        pleaseAnswerAll: '有一些问题没有得到解答。 请回答所有问题。',
        savedAnswer: '你已经保存了你的答案。',
        pleaseUploadBusinessCards: '為了確認本人，請上傳兩張名片之相片。',
        pleasePreventIdentityTheft: '為防冒用他人身分作答懇請協助。名片上傳完畢後即完成背景調查手續。',
        yourNameOnTheFront: '兩張名片皆為紀載名字面做攝影。',
        uploadPicture: '相片上傳',
        notSelected: '尚未選擇',
        registerAndContinue: '註冊並下一頁',
        thankYouReferenceCheck: '感謝您協助背景調查',
        informationKeptInStrictConfidence: '所作答的相關情報將嚴格管理保管。',
        failedToLoadPhoto: '无法加载照片。 请给它一些时间，再试一次。',
        failedToUploadBusinessCard: '上传名片失败。 请稍等片刻，再试。',
        deadlinePassed: '您的回复期限已过。',
        modifyYourAnswer: '修改您的答案',
        uploadedBusinessCard: '名片已上传',
        registeringPhoneNumber: '注册您的电话号码',
        toIncreaseSecurity: '为了增加安全性',
        pleaseRegisteringPhoneNumber: '请注册您的电话号码。',
        canReceiveSMS: '请输入可以接收短信的手机号码。',
        sendCode: '发送验证码',
        codeHasBeenSent: '验证码发送至{phoneNumber}。',
        reEnterNumber: '重新输入您的电话号码',
        authenticationCode: '验证码',
        invalidNumber: '无效的电话号码格式。',
        numberIsAlreadyRegistered: '该电话号码已经在另一个账户中注册',
        successfullyVerified: '您的电话号码已成功验证。',
        wrongAuthorizationCode: '错误的授权代码',
        onceYouHaveCompleted: '※一旦你完成了你的答案，你就不能再编辑了。',
        doYouCompleted: '你要完成你的答案吗？',
        messageAndURLForReferee: '我们收到了{honorific}的请求，要求进行参考调查回复。 请点击这个网址，给我们答案。'
      }
    }
  },
  talent: {
    jp: {
      message: {
        thankYouForYourApplication: '{companyName}にご応募いただきまして誠にありがとうございます。',
        pleaseInformYourReferences: '推薦者となる方へ事前にリファレンスを依頼する旨をお伝えください。',
        // ToDo: スタイル直指定ではなくviews/talent/instruction.vueのtimeを使いたい．
        pleaseInformYourReferencesText: 'リファレンスの回答にかかる平均所要時間はおよそ <span style="color: #1a86f5; font-size: 1.2em; font-weight: bold;">{minutes}分</span> です。また推薦者様には名刺によるご本人確認を実施させていただきます。もし名刺をご用意いただけない場合は、代わりに電話番号でもご登録いただけます。誠に恐れ入りますが、ご本人確認について事前に合わせてお伝えいただきますようお願い申し上げます。',
        thenRegisterYourReferences: '続いて推薦者様を登録してください。',
        thenRegisterYourReferencesText: '推薦者様は自由に選ぶことができます。ただし、企業が指定した関係性を満たす必要がございます。<br>たとえば企業が「上司」の方を「2名」と設定している場合は、必ず上司の方を2名以上登録してください。',
        pleaseSendRequestEmail: '推薦者様に依頼のメールを送ります。',
        pleaseSendRequestEmailText: '登録を完了すると推薦者様にメールで依頼が届きます。',
        pleaseIssueAndRequest: '各推薦者様に対する回答依頼ページのURLを発行し、回答を依頼してください。',
        pleaseIssueAndRequestText: '登録を完了すると各推薦者様に対する回答依頼ページのURLが発行されます。発行されたURLをそれぞれの推薦者様に伝え、回答を依頼してください。',
        pleaseRegisterYourReferences: '推薦者の登録をお願いいたします。',
        pleaseRegisterFollowingNominees: '以下の推薦者を登録してください',
        stillWorkingTogegher: '現在も一緒に仕事をしていますか？',
        sendEmailToAllRefereesButton1: '推薦者全体に', // レスポンシブ対応で途中改行するので分ける
        sendEmailToAllRefereesButton2: '依頼メールを送信する',
        addReferee: '推薦者の追加',
        saveReferee: '推薦者を保存',
        sendEmailToReferee: '推薦者へメールを送信する',
        placeholderName: '山田太郎',
        placeholderBelongs: '会社・役職',
        placeholderRelationship: '関係性を入力してください',
        placeholderOtherTimeWorkingTogether: '一緒に働いた時期を入力してください',
        placeholderCompany: '会社名を入力してください',
        placeholderSelect: '選択してください',
        validEmailRequire: 'メールアドレスを入力してください',
        validEmailFormat: 'メールアドレスの形式が無効です',
        validEmailFree: 'フリーメールを使用することはできません',
        validName: '氏名を入力してください',
        validBelongs: '会社名を入力してください',
        validRelationship: '関係性を選択してください',
        validTimeWorkingTogether: '一緒に仕事をした期間を選択してください',
        validTimeToBeginWorkingTogether: '一緒に仕事をした期間を入力してください',
        validJobCategory: '職種選択してください',
        validCompany: '会社名を入力してください',
        successMessageSaveReferee: '推薦者の保存',
        successMessageSendMail: 'メールの送信',
        confirmSendingMailModalTitle: '依頼メールの送信',
        confirmSendingMailModalText: '推薦者の方々に依頼メールを送信いたします',
        confirmSendingMailModalYes: '送信する',
        confirmSendingMailModalNo: '送信せず、推薦者情報を修正する',
        confirmSendingAllMailText: '推薦者全員に質問の回答依頼メールを送信します',
        commitDeleteReferee: '推薦者{number}を削除してもよろしいですか',
        warningInsufficientReferee: '保存される推薦者の人数が足りません',
        thankYouForRegistering: '推薦者のご登録ありがとうございました',
        informationKeptConfidential: 'ご提供頂きました情報は厳重に管理させていただきます。',
        backRegisteringPage: '推薦者の登録ページに戻る',
        copyText: '以下のテキストをコピーしました。',
        tellAndAsk: '{honorific}に伝えてリファレンスチェックを依頼してください',
        requestPageButtonBelow: '以下のボタンから各種推薦者の回答依頼ページURLを発行してください。',
        pasteURLToRequest: '発行されたそれぞれのURLをLINEやSNSツールに貼り付けて回答を依頼してください。',
        doNotHesitate: '※送り先など、お間違えの無いよう再度ご確認をお願いいたします。',
        publishButton: '発行ボタン',
        copyURL: 'URLをコピー',
        messageAndURLForTalent: 'リファレンスチェックの依頼が届いています。こちらのURLをクリックして頂きご登録をお願い致します。',
        goURLPublishing: 'URL発行へ進む'
      }
    },
    en: {
      message: {
        thankYouForYourApplication: 'Thank you for your application to {companyName}.',
        pleaseInformYourReferences: 'Please inform the person who will be your reference that you are requesting a reference in advance.',
        pleaseInformYourReferencesText: 'It will take approximately <span style="color: #1a86f5; font-size: 1.2em; font-weight: bold;">{minutes} minutes</span>  to complete a reference check. We will also ask for a business card to confirm your identity. If you are unable to provide your business card, you may use your telephone number instead.',
        thenRegisterYourReferences: 'Next, please register your references.',
        thenRegisterYourReferencesText: 'You can freely choose your references who meet the requirements provided by the company you applied to.<br>For example, if the company has set a limit of 2 "Supervisors", please register at least 2 Supervisors.',
        pleaseSendRequestEmail: 'Please send a request email to your references.',
        pleaseSendRequestEmailText: 'Upon completion of the registration, the recommender will receive a request by email.',
        pleaseIssueAndRequest: 'Please issue the URL of the response request page for each nominee and request a response.',
        pleaseIssueAndRequestText: 'After completing the registration, the URL of the response request page will be issued to each recommender. Please inform each recommender of the URL issued and request a response.',
        pleaseRegisterYourReferences: 'Please register your references.',
        pleaseRegisterFollowingNominees: 'Please register the references as follows',
        stillWorkingTogegher: 'Do you still work with them today?',
        sendEmailToAllRefereesButton1: 'Send a request email', // レスポンシブ対応で途中改行するので分ける
        sendEmailToAllRefereesButton2: ' to the entire nominator', // 空白を入れる
        addReferee: 'Add a nominator.',
        saveReferee: 'Save your references',
        sendEmailToReferee: 'Send an email to your recommenders',
        placeholderName: 'John Smith',
        placeholderBelongs: 'Company and Title',
        placeholderRelationship: 'Enter the relationship',
        placeholderOtherTimeWorkingTogether: 'Enter the time you worked together',
        placeholderCompany: 'Please enter company name',
        placeholderSelect: 'Please select one',
        validEmailRequire: 'Please enter your email address',
        validEmailFormat: 'Invalid email address format',
        validEmailFree: 'Cannot use free email',
        validName: 'Please enter your name',
        validBelongs: 'Please enter your company name',
        validRelationship: 'Please select a relationship',
        validTimeWorkingTogether: 'Select the length of time you have worked together',
        validTimeToBeginWorkingTogether: 'Please enter the length of time you worked together',
        validJobCategory: 'Please select a job title',
        validCompany: 'Please enter company name',
        successMessageSaveReferee: 'Saving your recommenders',
        successMessageSendMail: 'Sending an email',
        confirmSendingMailModalTitle: 'Sending a request email',
        confirmSendingMailModalText: 'We will send a request email to the nominees',
        confirmSendingMailModalYes: 'Send',
        confirmSendingMailModalNo: 'Correct recommender information without sending',
        confirmSendingAllMailText: 'Send a question answer request email to all nominees',
        commitDeleteReferee: 'May I remove reference {number}?',
        warningInsufficientReferee: 'There are not enough nominees to be saved',
        thankYouForRegistering: 'Thank you for your nomination!',
        informationKeptConfidential: 'The information you provide will be held in the strictest confidence.',
        backRegisteringPage: 'Return to Nominee Registration Page',
        copyText: 'Copied the following text.',
        tellAndAsk: 'Tell {honorific} and ask him to do a reference check.',
        requestPageButtonBelow: 'Please click the button below to issue the URL for the response request page for various recommenders.',
        pasteURLToRequest: 'Paste the respective URLs issued to your LINE or SNS tool to request a response.',
        doNotHesitate: '※If you have any questions, please do not hesitate to contact us.',
        publishButton: 'Publish Button',
        copyURL: 'Copy the URL',
        messageAndURLForTalent: 'We have received a request for a reference check response. Please click on this URL and send us your answer.',
        goURLPublishing: 'Proceed to URL publishing'
      }
    },
    cn: {
      message: {
        thankYouForYourApplication: '謝謝您此次的應徵。',
        pleaseInformYourReferences: '請事先通知作答者將進行背景調查事宜。',
        pleaseInformYourReferencesText: '調查平均所需時間是 <span style="color: #1a86f5; font-size: 1.2em; font-weight: bold;">{minutes}分鐘</span> 。另外作答者將用名片做本人確認。如果無法提供名片則請登記電話號碼。本人確認事宜也請與作答者事先通知。',
        thenRegisterYourReferences: '接著，請登記作答者。',
        thenRegisterYourReferencesText: '作答者可以自由選擇。但必須符合企業所指定的條件。<br>例如企業指定是「兩位」「上司」的話，必須要登記兩名以上的上司',
        pleaseSendRequestEmail: '请向您的提名人发送电子邮件请求。',
        pleaseSendRequestEmailText: '一旦您完成注册，您的提名人将收到一封包含您请求的电子邮件。',
        pleaseIssueAndRequest: '请为每个被提名人发布回复请求页的URL，并请求回复。',
        pleaseIssueAndRequestText: '完成注册后，将向每位推荐人发出响应请求页面的URL。 请告知发给每位被提名人的网址，请他们回答。',
        pleaseRegisterYourReferences: '懇請登記作答者的資訊。',
        pleaseRegisterFollowingNominees: '請登記以下的作答者。',
        stillWorkingTogegher: '現在仍然一起上班嗎',
        sendEmailToAllRefereesButton1: '向所有被提名者。', // レスポンシブ対応で途中改行するので分ける
        sendEmailToAllRefereesButton2: '发送电子邮件请求。',
        addReferee: '請追加作答者',
        saveReferee: '保存您的提名人。',
        sendEmailToReferee: '给您的推荐人发邮件。',
        placeholderName: '張三',
        placeholderBelongs: '公司・職位',
        placeholderRelationship: '请输入关系',
        placeholderOtherTimeWorkingTogether: '输入你们一起工作的时间',
        placeholderCompany: '請輸入公司名稱',
        placeholderSelect: '請選擇',
        validEmailRequire: '请输入您的电子邮件地址',
        validEmailFormat: '无效的电子邮件地址格式',
        validEmailFree: '您不能使用免费的电子邮件',
        validName: '請輸入姓名',
        validBelongs: '請輸入公司名稱',
        validRelationship: '請選擇關係姓',
        validTimeWorkingTogether: '請選擇一起工作的期間',
        validTimeToBeginWorkingTogether: '請輸入一起工作的期間',
        validJobCategory: '請選擇職種',
        validCompany: '请输入公司名称。',
        successMessageSaveReferee: '被提名人的保存',
        successMessageSendMail: '发送电子邮件',
        confirmSendingMailModalTitle: '发送请求邮件',
        confirmSendingMailModalText: '将向您的提名人发出请求。',
        confirmSendingMailModalYes: '发送。',
        confirmSendingMailModalNo: '不要发送和修改你的提名人信息。',
        confirmSendingAllMailText: '所有被提名人都将收到一封要求回答其问题的电子邮件。',
        commitDeleteReferee: '我可以删除参考文献{number}吗？',
        warningInsufficientReferee: '登記的作答者人數不足',
        thankYouForRegistering: '謝謝您登記作答者資訊',
        informationKeptConfidential: '您所提供的情報將嚴格管理。',
        backRegisteringPage: '回到作答者登記的頁面',
        copyText: '以下是复制的案文',
        tellAndAsk: '告诉{honorific}，让他做个参考调查。',
        requestPageButtonBelow: '请从下面的按钮发出各种推荐人的响应请求页的URL。',
        pasteURLToRequest: '请贴上发给您的LINE或SNS工具的相应URL来请求回复。',
        doNotHesitate: '※请确认您有正确的送货地址。',
        publishButton: '发令枪',
        copyURL: '复制URL',
        messageAndURLForTalent: '你已被要求对参考调查作出回应。 请点击此网址进行回复。',
        goURLPublishing: '进入URL发布'
      }
    }
  },
  remind: {
    jp: {
      message: {
        error: 'エラーが発生しました',
        errorText: 'お手数ですが、時間をおいてから、再度このページを読み込んでください',
        unSubscribe: 'リマインドメールの配信停止完了',
        thanks: 'MiKiWaMe Point をご利用いただきまして、誠にありがとうございます。',
        unSubscribeText: '<strong>{name}</strong>のリファレンスチェックについて、リマインドメールの配信を停止いたしました。'
      }
    },
    en: {
      message: {
        error: 'An error has occurred.',
        errorText: 'Please take a moment and read this page again.',
        unSubscribe: 'Completed unsubscribing from reminder emails.',
        thanks: 'Thank you very much for using MiKiWaMe Point.',
        unSubscribeText: 'We have stopped sending out reminder emails about {name}\'s reference checks.'
      }
    },
    cn: {
      message: {
        error: '发生了一个错误。',
        errorText: '请花点时间再读一下这个页面。',
        unSubscribe: '完成取消订阅提醒邮件的工作',
        thanks: '非常感谢您使用MiKiWaMe Point。',
        unSubscribeText: '我们已经停止发送关于{name}参考调查的提醒邮件。'
      }
    }
  },
  notify: {
    jp: {
      message: {
        answerSentSuccessfully: '回答の送信に成功しました。',
        answerSentFailed: '回答の送信に失敗しました。通信環境を確認したうえで再度お試しください。',
        somthingSuccess: '{message}に成功しました',
        errorSaving: '保存に失敗しました。通信環境を確認したうえで再度お試しください。',
        inputIsIncomplete: '入力に不備がございます',
        errorPleaseAgain: 'エラーが発生しました。通信環境を確認したうえで再度お試しください。',
        errorSmsAuthentication: 'SMSの認証でエラーが発生しました。通信環境を確認したうえで再度お試しください。',
        errorPhoneRegisteredCheck: '電話番号が登録済みか確認する過程でエラーが発生しました。',
        errorPleaseAuthenticateAgain: 'エラーが発生しました。再度認証を行い回答の送信をお願いします。'
      }
    },
    // 仮
    en: {
      message: {
        answerSentSuccessfully: 'The answer has been sent successfully.',
        answerSentFailed: 'Failed to send your answer. Please try again in a few minutes.',
        somthingSuccess: 'Successfully {message}',
        errorSaving: 'Failed to save. Please try again in a few minutes.',
        inputIsIncomplete: 'Input is incomplete',
        errorPleaseAgain: 'An error has occurred. Please wait a few minutes and try again.',
        errorSmsAuthentication: 'An error has occurred. Please wait a few minutes and try again.', // TODO
        errorPhoneRegisteredCheck: 'An error has occurred. ', // TODO
        errorPleaseAuthenticateAgain: 'An error has occurred. Please authenticate again and submit your answer.'
      }
    },
    // 仮
    cn: {
      message: {
        answerSentSuccessfully: '响应发送成功。',
        answerSentFailed: '未能发送您的答案。 请在几分钟后再试。',
        somthingSuccess: '我成功地拿到了{message}。',
        errorSaving: '保存失敗，請再待幾分鐘後重新嘗試',
        inputIsIncomplete: '你的输入不完整。',
        errorPleaseAgain: '发生了一个错误。 请稍等片刻再试。',
        errorSmsAuthentication: '发生了一个错误。 请稍等片刻再试。', // TODO
        errorPhoneRegisteredCheck: '发生了一个错误。', // TODO
        errorPleaseAuthenticateAgain: '发生了一个错误。 请再次认证并发送您的答案。'
      }
    }
  },
  common: {
    jp: {
      message: {
        sama: '様', // 名前のみstyle変更したいなどの場合に使用
        mrMs: '', // samaと同様の用途．敬称が頭に来る場合
        honorific: '{name} 様', // 敬称込みの名前
        boldHonorific: '<span style="font-weight: bold;">{name}</span> 様',
        about: '約',
        minutes: '分',
        next: '次へ',
        yes: 'はい',
        no: 'いいえ',
        numberOfPeople: '{number}名',
        total: '合計{number}名',
        referee: '推薦者',
        aboutReferenceCheck: 'リファレンスチェックについて',
        aboutReferenceCheckText1: 'リファレンスチェックとは、プライバシーおよび法令を遵守した上で、希望の応募者(以下、候補者様)に対して、以前または現職の同僚や上司からアンケートに回答していただくことによって、候補者様の人柄や実績に関する情報をご提供いただく採用手法のことです。',
        aboutReferenceCheckText2: '質問にご回答いただく推薦者様は、候補者様にそれぞれご指名いただきます。推薦者様よりご入力いただいた情報は、本採用活動でのみ利用され、候補者様を含む外部への開示は一切ございません。詳しくは下記の個人情報保護方針をご確認ください。',
        aboutMiKiWaMePoint: 'MiKiWaMe Pointについて',
        aboutMiKiWaMePointText1: 'MiKiWaMe Pointはリファレンスチェックを通じて、面接だけでは伝わりきらない情報(候補者様が積み上げられてきた信頼や実績といったもの)を、身近な第三者から転職先の企業へ伝えることで、採用におけるミスマッチを減らし、候補者様が入社後にご活躍できる環境を提供したいという思いでサービスを運営しております。',
        aboutMiKiWaMePointText2: 'お忙しいところ恐れ入りますが、貴重なご意見として、忌憚のない回答をしていただけますと幸いです。',
        usageFlow: 'ご利用の流れ',
        saveYourAnswer: '回答を保存',
        saveYourAnswerToNext: '回答を保存して次へ',
        sendYourAnswerToNext: '回答を送信して次へ',
        useOfServices: 'サービスのご利用にあたって',
        agreeToHandlingOfPersonalInformation: '個人情報の取り扱いに同意します',
        caution: 'ご注意',
        name: '氏名',
        belongs: '所属名',
        emailAddress: 'メールアドレス',
        phoneNumber: '電話番号(ハイフンなし)',
        relationshipWithReferences: '推薦者との関係',
        relationships: '関係性',
        timeWorkingTogether: '一緒に働いた時期',
        timeToBeginWorkingTogether: '一緒に仕事をした期間',
        jobCategory: '一緒に仕事をしたときの推薦者の職種',
        companyTogether: '一緒に仕事をしたときの推薦者の会社名',
        refereeLanguage: '推薦者の言語',
        noSpecification: '指定なし',
        confirm: '確定'
      }
    },
    en: {
      // 仮
      message: {
        sama: '',
        mrMs: 'Mr./Ms.',
        honorific: 'Mr./Ms. {name}',
        boldHonorific: 'Mr./Ms. <span style="font-weight: bold;">{name}</span>',
        about: 'About',
        minutes: 'minutes',
        next: 'Next',
        yes: 'Yes',
        no: 'No',
        numberOfPeople: '{number} people',
        total: 'Total {number} people',
        referee: 'Recommender',
        aboutReferenceCheck: 'About Reference Checks',
        aboutReferenceCheckText1: 'A reference check is one of the recruitment processes in which, subject to privacy and legal compliance, the preferred applicant (the "Candidate") is asked to provide information about the Candidate\'s character and performance by completing a questionnaire from a former or current colleague or supervisor.',
        aboutReferenceCheckText2: 'The candidate will be asked to nominate a nominator to answer the questions. The information provided will be used only for the purpose of this recruitment process and will not be disclosed to any third party including the candidate. For more information, please refer to our Privacy Policy below.',
        aboutMiKiWaMePoint: 'About MiKiWaMe Point',
        aboutMiKiWaMePointText1: 'MiKiWaMe Point reduces mismatches in hiring by communicating information that cannot be conveyed through interviews alone (such as the trust and accomplishments that candidates have built up over the years) from a close third party to the client company through reference checking, thereby reducing the number of hiring mismatches and preparing an environment in which the candidate can flourish after joining the company. We operate our service with the intention of providing it.',
        aboutMiKiWaMePointText2: 'We would appreciate it if you could provide us with a candid response, as it would be valuable to us.',
        usageFlow: 'Flow of Use',
        saveYourAnswer: 'Save your answer',
        saveYourAnswerToNext: 'Save your answer to the next',
        sendYourAnswerToNext: 'Send your answer to the next',
        useOfServices: 'Terms of Use',
        agreeToHandlingOfPersonalInformation: 'I agree to the processing of my personal information.',
        caution: 'Note',
        name: 'Name',
        belongs: 'Department',
        emailAddress: 'Email address',
        phoneNumber: 'Phone number (no hyphen)',
        relationshipWithReferences: 'Relationship with the reference',
        relationships: 'Relationships',
        timeWorkingTogether: 'When we worked together',
        timeToBeginWorkingTogether: 'Enter the time you worked together. How long have you worked together?',
        jobCategory: 'The job title of the reference when you worked together',
        companyTogether: 'Company name of your reference when you worked together',
        refereeLanguage: 'Preferred Language of the reference',
        noSpecification: 'No designation',
        confirm: 'Confirm'
      }
    },
    cn: {
      // 仮
      message: {
        sama: '先生/女士',
        mrMs: '',
        honorific: '{name} 先生/女士',
        boldHonorific: '<span style="font-weight: bold;">{name}</span> 先生/女士',
        about: '大约',
        minutes: '分钟',
        next: '以及',
        yes: '是',
        no: '不是',
        numberOfPeople: '{number}人',
        total: '共计{number}人',
        referee: '推荐人',
        aboutReferenceCheck: '關於背景調查',
        aboutReferenceCheckText1: '背景調查是指，遵守個人隱私權及遵守相關法令條件之下，對欲聘僱人選(以下稱,候選者)的前或現任職場同事及主管進行交流並得到候選者的工作態度和工作績效的錄取手法。',
        aboutReferenceCheckText2: '交流洽詢對象由候選者(以下稱,推薦者)所指名。洽詢對象所提供的情報僅利用在此面試過程之中，不會對候選者以及第三者公開。詳細請參考以下格人情報保護條例。',
        aboutMiKiWaMePoint: '關於MiKiWaMe Point',
        aboutMiKiWaMePointText1: 'MiKiWaMe Point是在背景調查過程中的面試程序中無法完全表達的情報(候選者所累積的信賴和績效等)，由身邊的第三者陳述新應徵公司進而降低企業之聘僱與管理，並能達到候選者入社後能善用己身技能於職場的服務。',
        aboutMiKiWaMePointText2: '承蒙您的協助，如能提供貴重的建議和無忌憚地回答。',
        usageFlow: '程序如下',
        saveYourAnswer: '保存您的答案',
        saveYourAnswerToNext: '保存你的答案，继续前进。',
        sendYourAnswerToNext: '提交答案，继续前进。',
        useOfServices: '在利用服務之前',
        agreeToHandlingOfPersonalInformation: '同意個人情報的登記',
        caution: '注意',
        name: '姓名',
        belongs: '所屬名',
        emailAddress: '郵件信箱',
        phoneNumber: '电话号码(无连字符)',
        relationshipWithReferences: '與作答者的關係',
        relationships: '關係',
        timeWorkingTogether: '一起上班的期間',
        timeToBeginWorkingTogether: '請填入一起上班的期間',
        jobCategory: '一起工作時候的作答者的職位',
        companyTogether: '一起工作時候作答者所屬的公司名',
        refereeLanguage: '作答者的語言',
        noSpecification: '無指定',
        confirm: '确认输入'
      }
    }
  },
  termsOfService: {
    jp: {
      message: {
        text: `
        <h3>利用規約</h3>
        <p>この規約 (以下「本規約」といいます。) は、株式会社HRRT (以下「当社」といいます。) が提供するリファレンスチェック及び反社チェックに関するサービス「MiKiWaMe Point」 (サービスの内容又は名称が変更された場合には当該変更後のサービスを含み、以下「本サービス」といいます。)について、採用候補者又は推薦者（以下総称して「利用者」といいます。）の皆様との間の権利義務関係を定めるものです。本サービスに登録する前に、本規約をよくお読み頂いたうえで、本規約に同意いただく必要があります。</p>
        <h4>第1条 (本規約の目的及び適用)</h4>
        1.	本規約は、当社が利用者に対し、本サービスを提供するにあたり、その基本的な契約 (以下、本規約に基づく当社と利用者及び本サービスの利用を希望する者（以下「利用希望者」といいます。）との間の契約を「本契約」といいます。) の条件を明示し、当社と利用者との間の権利義務関係を定めることを目的とします。<br>
        2.	当社が、別途書面、電子メール又は当社ウェブサイト (mikiwame-p.jp(理由の如何を問わず、当該ウェブサイトのドメイン又は内容が変更された場合は、当該変更後のドメイン等を含みます。以下も同様とします。) ) 等により随時掲載する本サービスに関する個別規定や追加規定等（以下「個別規定等」といいます。）は本規約の一部を構成するものとし、個別規定、追加規定又はルール等 (以下「個別規定等」といいます。) が本規約と抵触する場合には、当該個別規定等が優先されるものとします。なお、本規約の改定又は変更については第20条で定めるものとします。<br>
        <h4>第２条（定義）</h4>
        1.	「採用候補者」とは、求人企業に対して就職活動又は転職活動を行っている求職者等をいいます。<br>
        2.	「推薦者」とは、採用候補者が本サービスを通じて自身に関する情報提供を依頼した者をいいます。<br>
        3.	「利用希望者」とは、本サービスの利用を希望する者をいいます。<br>
        <h4>第３条 (登録)</h4>
        1.	利用希望者は、本規約を遵守することに同意し、当社の定める方法に従い、当社の定める一定の情報（以下「登録情報」といいます。）を当社に提供することにより、本サービスにおける登録の申請をすることができます。<br>
        2.	当社は、前項の登録申請があった場合、別途当社の定める審査基準に従って審査し、当該申請を承諾する場合には、利用希望者に対してその旨の通知を行います。<br>
        3.	前項の場合、当社は、審査に必要な書類の提出を求めることがあり、利用希望者は、当該書類を速やかに提出するものとします。利用希望者が当該書類を提出しない場合その他当社の定める審査基準に適合しない場合には、当社は、利用希望者の登録申請を拒否することができるものとします。<br>
        4.	当社は、前項に定めるほか、第1項に基づき登録を申請した利用希望者が、次の各号のいずれかの事由に該当する場合は、登録を拒否することがあります。<br>
        (1)	当社に提供された情報の全部又は一部につき虚偽、誤記又は記載漏れがあった場合<br>
        (2)	当該利用希望者が、本契約を締結するための法的権利又は地位を有しない場合<br>
        (3)	当該利用希望者が、本サービス利用に際して、既にアカウント削除等のサービス利用停止措置を受けた又は受けている場合<br>
        (4)	反社会的勢力等 (暴力団、暴力団員、右翼団体、反社会的勢力、その他これに準ずる者を意味し、以下も同様とします。) である、又は資金提供その他を通じて反社会的勢力等の維持、運営若しくは経営に協力若しくは関与する等反社会的勢力等との何らかの交流若しくは関与を行っている、又は過去にこれらに該当していたと当社が判断した場合<br>
        (5)	その他、当社が登録を適当でないと判断した場合<br>
        <h4>第４条 (登録情報の提供・変更)</h4>
        1.	利用希望者又は利用者は、登録情報の登録にあたっては、真実かつ正確な情報を、個人情報保護法を含む法令、規則等に違反しないように提供するものとします。また、登録情報に誤りがあった場合又は変更が生じた場合、利用希望者又は利用者は、自己の責任において、速やかに登録情報を修正又は変更するものとします。<br>
        2.	当社は、利用希望者又は利用者自身が登録した登録情報を前提として、本サービスを提供します。これらの情報の内容に虚偽、誤り、記載漏れ又は変更未了があったことにより利用希望者又は利用者に損害が生じたとしても、当社は一切責任を負いません。<br>
        3.	利用希望者又は利用者が登録情報の修正又は変更を怠ったことにより、当社からの通知が不到達となった場合、当該通知は、通常到達すべき時に到達したとみなされるものとします。<br>
        <h4>第５条 (アカウントの管理)</h4>
        1.	利用者は、自己の責任において本サービス上のアカウントを管理及び保管するものとし、これを第三者に利用させ、又は貸与、譲渡、名義変更、売買等をしてはならないものとします。<br>
        2.	アカウントの管理不十分、使用上の過誤、第三者の使用等による損害の責任は利用者が負うものとし、当社は一切の責任を負いません。<br>
        3.	利用者は、アカウントが盗用され又は第三者に使用されていることが判明した場合には、直ちにその旨を当社に通知するとともに、当社からの指示に従うものとします。<br>
        4.	当社は、利用者における本サービス上の利用が完了したと合理的に判断した場合には、速やかに当該利用者のアカウントを削除します。<br>
        <h4>第６条 (表明保証)</h4>
        1.	利用者は、本サービス上の質問に対して、自身の経験及び知識に基づき、正確に回答し、虚偽の回答をしないことを表明し、保証します。<br>
        2.	利用者である採用候補者は、推薦者に対して、本サービス上の質問に自身の経験及び知識に基づき正確に回答させるものとし、当該回答を妨害したり、虚偽の回答を依頼したりしないことを表明し、保証します。<br>
        <h4>第７条 (本サービスの利用)</h4>
        1.	利用者は、本契約の範囲内において、当社の定める方法に従い、本サービスを利用することができます。<br>
        2.	利用者は、本サービスを当社から提供された状態で利用するものとし、本サービスの複製、修正、変更、改変又は翻案を行うことはできません。また、利用にあたっては、当社が別途指定する条件に従うものとします。<br>
        3.	利用者は、本サービスを、直接的又は間接的にかかわらず、第三者に対する業務提供その他これに類似する用途に用いてはならないものとします。<br>
        4.	本サービスの提供を受けるために必要なコンピューター、ソフトウェアその他の機器、通信回線その他の通信環境等の準備及び維持は、利用者の費用と責任において行うものとします。<br>
        <h4>第８条 (本サービスの利用料金)</h4>
        利用者は、別途当社と合意する場合を除き、本サービスの利用料金を支払う義務を負いません。<br>
        <h4>第9条 (禁止事項)</h4>
        利用者は、本サービスの利用にあたり、自ら又は第三者をして、次の各号のいずれかに該当する行為をし、又はさせてはなりません。また、次の各号の行為を直接又は間接に惹起し、又は容易にしてはなりません。<br>
        (1)	当社、採用候補者、推薦者その他の第三者に対する誹謗中傷行為、詐欺若しくは脅迫行為、又は虚偽の情報を提供する行為<br>
        (2)	本サービス又は本サービスに関連して当社が開示又は提供した情報をSNS等で公開する行為<br>
        (3)	採用候補者、推薦者又は求人企業に対する不誠実な行為<br>
        (4)	当社、採用候補者、推薦者、求人企業その他の第三者の知的財産権、肖像権、プライバシー、名誉、その他の権利若しくは利益を侵害する行為又はそのおそれのある行為<br>
        (5)	本サービスの誤作動を誘引する行為<br>
        (6)	以下に該当し又は該当すると当社が判断した情報を本サービス上で伝達する行為<br>
        ①	自殺、自傷行為を誘引、勧誘又は助長する表現を含む情報<br>
        ②	薬物・危険ドラッグの売買に関する情報又は薬物・危険ドラッグの不適切な利用を助長する表現を含む情報<br>
        ③	宗教的行為、宗教団体、政治的活動、政治団体の宣伝又は広告の情報<br>
        ④	残虐な表現、性的な表現その他、他人に不快感を与えるおそれがある情報<br>
        ⑤	コンピュータウィルス等の有害なプログラムを流布させる情報<br>
        ⑥	その他当社が不適切と判断する情報<br>
        (7)	本サービス又は当社サーバー等に過度の負担をかける行為<br>
        (8)	本サービスに接続しているシステムに権限なく不正にアクセスする行為<br>
        (9)	当社又は他の利用者その他の第三者に成りすます行為<br>
        (10)	本サービスの正常な運営を妨害する行為<br>
        (11)	反社会的勢力等となる、又は資金提供その他を通じて反社会的勢力等の維持、運営若しくは経営に協力若しくは関与する等反社会的勢力等との何らかの交流若しくは関与を行う行為<br>
        (12)	本規約のいずれかの条項に違反する行為<br>
        (13)	当社からの問合せ等の回答を求める連絡に対して30日間以上応答しない行為<br>
        (14)	その他当社が不適切と判断する行為<br>
        <h4>第10条 (登録抹消等)</h4>
        1.	当社は、利用者が前条第1項各号又は次の各号の一に該当し若しくは該当するおそれがあると当社が判断した場合、又は本サービスの運営・保守管理上必要である場合には、何らの通知も行うことなく、当社の裁量により、当該利用者に対し、利用者に関する情報の全部若しくは一部の削除、本サービスの一時停止若しくは制限又はアカウント削除等の措置 (以下「業務停止等」といいます。) を講じることができるものとします。<br>
        (1)	本契約の条項に違反し、又は違反したとの通報を受けた場合<br>
        (2)	監督官庁から営業停止又は取消等の処分等を受けた場合<br>
        (3)	当社に提供された情報の全部又は一部につき虚偽の事実があることが判明した場合<br>
        (4)	差押、仮差押、仮処分又は租税滞納処分を受けた場合<br>
        (5)	支払停止若しくは支払不能となり、又は破産手続開始若しくはこれらに類する手続の開始の申立てがあった場合<br>
        (6)	本サービスの運営、保守管理上必要である場合その他前各号に準じる事由がある場合<br>
        2.	当社は、利用者のアカウント削除後も、当該利用者が当社に提供した情報を保有・利用することができるものとします。<br>
        3.	当社は、利用者が前条第1項各号又は本条第1項各号の一に該当し又は該当するおそれがあると当社が判断した場合には、利用者に対し、違反行為の中止、送信又は公開した情報の自発的な削除・訂正等を求めることがあり、利用者は、当社が定める期間内に当該求めに応じるものとします。<br>
        4.	当社は、本条に基づき当社が行った措置により利用者に生じた不利益及び損害について当該不利益又は損害の発生について、当社に故意又は重過失がない限り、一切の責任を負いません。<br>
        <h4>第11条 (権利帰属)</h4>
        1.	本サービス及び本サービス内の当社コンテンツ (本サービスにおいて当社が利用者に対し提供する全ての情報 (文章、画像、動画、音声、音楽その他のサウンド、イメージ、ソフトウェア、プログラム、コードその他のデータを含みますが、これらに限られません。) をいいます。以下同じ。) に関する一切の知的財産権は、当社又は当社にライセンスを許諾している者に帰属します。<br>
        2.	当社は、利用者に対し、本サービスを通じて当社が提供したすべての当社コンテンツについて、本サービスを利用して採用候補者又は推薦者の情報を提供することに必要な範囲内における私的な利用を許諾しますが、利用者に対し、本規約上で明示する以外の権利を認めるものではありません。<br>
        3.	本サービス上、商標、ロゴ及びサービスマーク等 (以下、総称して「商標等」といいます。)が表示される場合がありますが、当社は、利用者その他の第三者に対し、商標等を譲渡し、又はその利用を許諾するものではありません。<br>
        <h4>第12条 (本サービスの変更・中断・終了等)</h4>
        1.	当社は、利用者に事前に通知することなく、本サービスの内容の全部又は一部を変更又は追加することができるものとします。<br>
        2.	当社は、事前に、当社ウェブサイト上への掲示その他の当社が適当と判断する方法で利用者に通知することにより、当社の裁量で、本サービスの全部又は一部の提供を終了することができるものとします。ただし、緊急の場合は利用者への通知を行わない場合があります。<br>
        3.	当社は、次の各号の事由が生じた場合には、利用者に事前に通知することなく、本サービスの全部又は一部を一時的に中断することができるものとします。<br>
        (1)	本サービス用の通信機器設備等に関わるメンテナンスや修理を定期的又は緊急に行う場合<br>
        (2)	アクセス過多、その他予期せぬ要因でシステムに負荷が集中した場合<br>
        (3)	利用者のセキュリティを確保する必要が生じた場合<br>
        (4)	電気通信事業者の役務が提供されない場合<br>
        (5)	地震、水害等の天災、火災、停電、その他の不慮の事故又は戦争、紛争、動乱、暴動、労働争議等により本サービスの提供が困難な場合<br>
        (6)	法令又はこれに基づく措置により本サービスの運営が困難となった場合<br>
        (7)	その他前各号に準じ当社が必要と判断した場合<br>
        4.	当社は、本条に基づき当社が行った措置により利用者に生じた損害について当該不利益又は損害の発生について、当社に故意又は重過失がない限り、一切の責任を負いません。<br>
        <h4>第13条 (保証の否認及び免責)</h4>
        1.	当社は、利用者から取得した情報の全部又は一部を、採用候補者が就職又は転職を希望している求人企業に提供することがありますが、当該求人企業が適切に当該情報を管理することについて保証を行うものではありません。なお、当該求人企業に採用された採用候補者の情報は、当社と当該求人企業との契約終了後も、求人企業が保有を継続するものとし、当社は当該情報を破棄するよう当該求人企業に要求しますが、当該求人企業が適切に当該情報を破棄することついて保証を行うものではありません。<br>
        2.	当社は、本サービス及び本サービスを通じて提供される当社コンテンツその他一切の情報につき、利用者の特定の目的への適合性、商用的価値、正確性、有用性、完全性、適法性、利用者に適用のある団体の内部規則等への適合性、及びセキュリティ上の欠陥、エラー、バグ又は不具合が存しないこと、並びに第三者の権利を侵害しないことについて、如何なる保証も行うものではありません。<br>
        3.	当社は、本サービスがすべての情報端末に対応していることを保証するものではなく、本サービスの利用に供する情報端末の OS のバージョンアップ等に伴い、本サービスの動作に不具合が生じる可能性があることにつき、利用者は予め了承するものとします。当社は、かかる不具合が生じた場合に当社が行うプログラムの修正等により、当該不具合が解消されることを保証するものではありません。<br>
        4.	本サービスに関し、利用者と第三者（採用候補者、推薦者及び求人企業を含みますが、これらに限りません。）との間で紛争が生じた場合、利用者は、直ちにその旨を当社に通知するとともに、自己の責任と費用においてこれを解決するものとし、当社はこれに一切関与せず、何ら責任を負わないものとします。<br>
        <h4>第14条 (損害賠償)</h4>
        1.	利用者による本契約の違反行為その他本サービスの利用に起因して、当社に直接又は間接の損害が生じた場合 (当該行為が原因で、当社が第三者から損害賠償請求その他の請求を受けた場合を含みます。) 、利用者は、当社に対し、そのすべての損害(解決金や弁護士費用、当社において対応に要した人件費相当額が含まれますが、これらに限られません。) を賠償しなければなりません。<br>
        2.	当社は、本契約の違反行為その他本サービスの利用に起因して利用者が被った損害について、当該損害の発生について当社に故意又は重過失がある場合にのみ責任を負うものとします。ただし、当社が負う責任は、利用者に現実に発生した直接かつ通常の損害に限ります。<br>
        <h4>第15条 (秘密保持)</h4>
        1.	利用者は、当社の事前の書面による承諾がある場合を除き、本サービス及び本サービスに関連して当社が開示又は提供した情報 (質問内容、採用候補者が就職又は転職を希望している求人企業の名称、採用候補者と推薦者の関係等を含みますが、これらに限りません。以下「秘密情報」といいます。) を秘密に取り扱い、第三者に開示又は提供（SNS等で公開する行為を含みます。）しないものとします。ただし、当社の同意を得た場合、又は法令により第三者への開示若しくは提供を強制され、必要最小限度の範囲で開示又は提供する場合を除きます。<br>
        2.	前項にかかわらず、次の各号のいずれかに該当する情報は、前項における秘密情報から除くものとします。<br>
        (1)	開示若しくは提供の時点で既に公知のもの、又は開示若しくは提供後秘密情報を受領した利用者の責によらずして公知となったもの<br>
        (2)	利用者が第三者から秘密保持義務を負うことなく正当に入手したもの<br>
        (3)	開示又は提供の時点で利用者が既に保有しているもの<br>
        3.	利用者は、当社から求められた場合はいつでも、当社の指示に従い、遅滞なく、第1項の秘密情報及び当該情報を記載又は記録した書面その他の記録媒体物並びにそのすべての複製物等を返却又は廃棄しなければなりません。<br>
        4.	利用者は、第1項の規定に違反して秘密情報を第三者に開示又は提供した場合には、当社が指定する当該違反行為への対応（公開したSNSの削除、情報を提供した第三者の連絡先の提供等）を速やかに講じるものとする。<br>
        5.	本条の規定は、本契約終了後も2年間効力を有するものとします。<br>
        <h4>第16条 (利用者の提供する情報の利用)</h4>
        1.	当社は、登録情報又は利用者の情報、利用者の本サービス上での一切のコミュニケーション情報、端末情報その他本サービスの利用に関し利用者から収集する情報 (以下「会員情報等」といいます。)を、別途当社が定める個人情報取扱指針に従い、適切に取り扱います。<br>
        2.	当社は、利用者が当社に提供した情報を、当社の裁量で、本サービスの提供及び運用、サービス内容の改良及び向上、本サービスの利用状況の把握等の目的のために利用し、又は個人を特定できない形での統計的な情報として、企業に対する提案又はコンサルティング、新サービスの開発その他の目的のために利用することができるものとします。<br>
        3.	当社は、本サービスの事業運営上、合理的に必要な範囲で、会員情報等を、採用候補者が就職又は転職を検討している求人企業（ただし、当社が事前に利用者に通知した企業に限ります。）に提供することができるものとします。<br>
        <h4>第17条 (連絡・通知)</h4>
        1.	本規約の変更に関する通知その他本サービスに関する当社から利用者への連絡は、当社ウェブサイト内の適宜の場所への掲示、電子メールの送信その他当社が適当と判断する方法により行うものとします。<br>
        2.	本サービスに関する問い合わせその他本契約に基づく利用者から当社に対する連絡又は通知は、当社ウェブサイト内の適宜の場所に設置するお問い合わせフォームへの送信その他当社が指定する方法により行うものとします。<br>
        <h4>第18条 (権利義務の譲渡禁止)</h4>
        利用者は、当社の書面による事前の承諾なく、本契約上の地位又は本契約に基づく権利義務の全部又は一部を、第三者に譲渡 (合併、会社分割等による包括承継を含みます。) し又は担保の目的に供することはできません。<br>
        <h4>第19条 (事業譲渡等の場合の取扱い)</h4>
        当社が本サービスにかかる事業の全部又は一部を他社に譲渡等する場合、当社は、当該事業譲渡等に伴い本契約上の地位、権利及び義務並びに会員情報等を当該事業譲渡等の譲受人に譲渡できるものとし、利用者は、かかる譲渡等につき本条において予め同意したものとみなします。本条にいう事業譲渡等には、当社が消滅会社又は分割会社となる合併又は会社分割等による包括承継を含むものとします。<br>
        <h4>第20条 (本規約の改定・変更)</h4>
        1.	当社は、当社の判断において、いつでも本規約の内容を変更又は追加できるものとします。変更後の利用規約は、当社が別途定める場合を除いて、当社ウェブサイトに掲示された時点より効力を生じるものとします。<br>
        2.	当社は、本規約を変更する場合には、当社ウェブサイトに掲載する方法その他別途当社が適切と判断する方法で、利用者に当該変更内容を公表するものとし、当該公表をもって効力が生じるものとします。当該変更内容の公表後、利用者が本サービスを利用した場合又は当社の定める期間内に何らの異議も述べなかった場合 (特段の期間を定めなかった場合には1ヶ月以内とします。) には、利用者は、本規約の変更に同意したものとみなします。<br>
        <h4>第21条 (本契約の有効期間)</h4>
        本契約の有効期間は、第３条に基づく登録を行った日から、利用者のアカウントが削除される日までとします。<br>
        <h4>第22条 (契約終了時の処理)</h4>
        1.	本契約が期間満了その他の理由により終了した場合、利用者は本サービスを一切利用できないものとし、当社から提供された一切の物品 (本サービスの仕様書、操作マニュアル等を含みます。) を直ちに当社に返還するか又は当社の指示に従って廃棄してその旨の証明書を当社に交付するものとします。<br>
        2.	本契約が終了、解除、又は解約された場合、利用者はその日以降は、本サービスに関連してダウンロード、コピーしたデータ、抽出した資料(媒体は問いません。) を、法令で定められた保存のために保持する情報及び本契約の終了、解除又は解約の時点で利用者において保存することにつき合理的根拠が認められるものを除き全て廃棄又は削除するものとします。<br>
        3.	本契約が終了、解除又は解約された場合も、当社は、本サービスによって利用者から得られた情報を廃棄又は削除せず、保有を続けることができるものとします。ただし、当社は、利用者が登録した採用候補者に関する情報のうち、採用候補者が特定の求人企業に応募をし、特定の求人企業が採用を検討していた事実を特定できる情報については、保存することにつき合理的根拠が認められるものを除き全て廃棄又は削除するものとします。<br>
        4.	本契約が終了、解除又は解約された場合であっても、第４条第2項、第５条第2項、第10条第2項及び第4項、第12条第4項、第13条第1項及び第4項、第14条、第15条、第16条第2項、第18条、第19条、本条並びに第23条乃至第25条は、有効に存続するものとします。<br>
        <h4>第23条 (分離可能性)</h4>
        1.	本規約のいずれかの条項又はその一部が無効又は執行不能と判断された場合であっても、当該判断は他の部分に影響を及ぼさず、本規約の残りの部分は、引き続き有効かつ執行力を有するものとします。当社及び利用者は、当該無効若しくは執行不能とされた条項又は部分の趣旨に従い、これと同等の効果を確保できるように努めるとともに修正された本規約に拘束されることに同意するものとします。<br>
        2.	本規約のいずれかの条項又はその一部が、ある利用者との関係で無効又は執行不能と判断された場合であっても、他の利用者との関係における有効性等には影響を及ぼさないものとします。<br>
        <h4>第24条 (準拠法及び合意管轄)</h4>
        本契約は日本法に準拠するものとし、本契約に起因し又は関連する一切の紛争については、その訴額に応じ、東京地方裁判所又は東京簡易裁判所を第一審の専属的合意管轄裁判所とします。<br>
        <h4>第25条 (協議解決)</h4>
        当社及び利用者は、本契約に定めのない事項又は本契約の解釈に疑義が生じた場合には、互いに信義誠実の原則に従って協議の上速やかに解決を図るものとします。<br>
        `,
        end: '以上',
        enactment: '2020年9月1日&emsp;制定'
      }
    },
    en: {
      message: {
        text: `
        <h3>Terms of Use</h3>
        <p>These terms and conditions ("Agreement") set forth the rights and obligations between the candidate, reference and all others ("Users") who are using MiKiWaMe Point service ("Service") provided by HRRT, Inc. ("HRRT") related to reference and anti-checking. Users are required to read this Agreement carefully and agree to it before registering for the Service.</ p>
        <h4>1 Purpose and Application of these Terms and Conditions</h4>
        1.1 These Terms and Conditions are a part of the basic agreement between HRRT and Users and those who wish to use the Service. The purpose of this Agreement is to specify the terms and conditions of the Agreement and to define the relationship of rights and obligations between HRRT and Users.<br>
        2.2 HRRT shall not be liable for any loss or damage arising out of the use of the HRRT's website (mikiwame-p.jp (in the event that the domain or content of the website has been changed for any reason, the domain, etc. after the change is also apply to this Agreement). The same applies to the following). If the individual provisions and additional provisions, etc. ("individual provisions, etc.") regarding the Service that are posted from time to time on the website (including the domain, etc., after the change) of HRRT's website are in conflict with these Terms and Conditions, "individual provisions, etc." shall constitute part of these Terms and Conditions. In addition, any amendments or modifications to the Terms and Conditions shall be set forth in Article 20.<br>
        <h4>2 Definitions</h4>
        A "Candidate" is a person who is looking for a job or is looking for a new job with a company.<br>
        A "Reference" is a person who has been requested by a candidate to provide information about himself/herself through this service.<br>
        "Applicant" refers to a person who wishes to use this service.<br>
        <h4>3 Registration</h4>
        3.1 Users may apply for registration in the Service by providing HRRT with certain information specified by HRRT ("Registration Information") in accordance with the method specified by HRRT. <br>
        3.2 When HRRT receives the application for registration, HRRT shall examine the application in accordance with the examination criteria separately set forth by HRRT, and if HRRT accepts the application, HRRT shall notify the applicant to that effect.<br>
        3.3 In the case of 3.2, HRRT may request the applicant to submit documents necessary for the examination, and Users applicant shall submit the relevant documents promptly. If Users applicant does not submit the relevant documents or fails to meet the screening standards set by HRRT, HRRT may reject the registration application of Users applicant.<br>
        3.4 In addition to the preceding paragraph, HRRT may refuse to register a User who has applied for registration in accordance with Paragraph 1, if any of the following reasons applies to Users<br>
        (1) If all or part of the information provided to HRRT is false, misspelled or omitted.<br>
        (2) Where the prospective user does not have the legal right or position to enter into this Agreement.<br>
        (3) When the prospective user has already undergone or are undergoing account deletion or other service suspension measures when using the Service.<br>
        (4) Anti-social forces, etc. (meaning gangs, gangsters, right wing groups, anti-social forces, and other persons equivalent to this, and the same applies to the following), or is involved in or interacts with anti-social forces, etc., such as cooperating with or being involved in the maintenance, operation or management of anti-social forces, etc. through the provision of funds or other means, or is deemed by HRRT to have fallen under these categories in the past.<br>
        (5) In any other case in which HRRT deems registration to be inappropriate.<br>
        <h4>4 Provision and modification of registration information</h4>
        4.1 When registering registered information, the prospective user or user shall provide truthful and accurate information in a manner that does not violate laws and regulations, including the Personal Information Protection Law. If there is an error or change in the registered information, the applicant or user shall, at their own responsibility, promptly correct or change the registered information.<br>
        4.2 HRRT shall provide the Service on the premise that the registration information registered by the prospective user or user himself/herself is correct. HRRT shall not be responsible for any damages caused to prospective users or users due to any falsehoods, errors, omissions, or missed changes in the information.<br>
        4.3 When a notice from HRRT is not received due to the failure of a user or user to correct or change his/her registration information, such notice shall be deemed to have been received at the time when it should have normally been received.<br>
        <h4>5 Management of Users account</h4>
        5.1 Users shall manage and store their accounts on the Service at their own responsibility, and shall not allow any third party to use their accounts, lend, transfer, change the name of their accounts, sell, or otherwise transfer their accounts to a third party.<br>
        5.2 Users shall be responsible for any damage caused by inadequate management of their account, misuse of their account, or use by a third party, and HRRT shall not be liable for any damage.<br>
        5.3 If it is found that Users account has been stolen or is being used by a third party, they shall immediately notify HRRT of this fact and follow HRRT's instructions.<br>
        5.4 HRRT shall promptly delete the account of users in question when HRRT reasonably determines that users have completed the use of the Service.<br>
        <h4>6 Representations and Warranties</h4>
        6.1 Users represent and warrant that they will answer questions on the Service accurately based on their experience and knowledge and that they will not give false answers.<br>
        6.2 Users represent and warrant that they will cause their reference to answer accurately based on their experience and knowledge of the questions on this service and will not interfere with such answers or request a false answer.<br>
        <h4> 7 Use of this Service</h4>
        7.1 Users may use the Service within the scope of this Agreement and in accordance with the methods prescribed by HRRT.<br>
        7.2 Users shall use the Service as it is provided by HRRT, and shall not duplicate, modify, change, alter or adapt the Service. Users shall abide by the terms and conditions separately specified by HRRT in using the Service.<br>
        7.3 Users shall not use the Service, directly or indirectly, to provide business to any third party or for any other similar purpose.<br>
        7.4 The preparation and maintenance of computers, software and other equipment, communication lines and other communication environment, etc., necessary to receive the Service shall be done at the cost and responsibility of Users.<br>
        <h4>8 Charges for the Service</h4>
        Users are not obligated to pay any fees for the use of the Service unless otherwise agreed with HRRT.<br>
        <h4>9 Prohibition</h4>
        In using the Service, Users shall not cause or allow themselves or any third party to commit any of the following acts. In addition, Users must not directly or indirectly cause or facilitate any of the following acts<br>
        (1) Slander, defame, fraud or threaten, or provide false information to HRRT, a candidate for employment, a recommender or any other third party.<br>
        (2) Disclosing the Service or any information disclosed or provided by HRRT in relation to the Service on SNS, etc.<br>
        (3) Dishonest behavior toward a candidate, recommender or employer<br>
        (4) Any act that infringes or may infringe on the intellectual property rights, portrait rights, privacy, honor, or other rights or interests of HRRT, a candidate for employment, a recommender, a recruiting company, or any other third party.<br>
        (5) Any act that induces a malfunction of the Service.<br>
        (6) Communicating on the Service any information that falls under any of the following, or that HRRT deems to fall under any of the following<br>
        ① Information that contains expressions that induce, solicit, or encourage suicide or self-injury<br>
        ② Information on the sale of drugs or dangerous drugs or information containing expressions that promote the inappropriate use of drugs or dangerous drugs.<br>
        ③ Information on religious acts, religious organizations, political activities, and propaganda or advertising of political organizations.<br>
        ④ Information that may cause discomfort to others, such as cruelty, sexual expressions and other information.<br>
        ⑤ Information that disseminates harmful programs such as computer viruses.<br>
        ⑥ Other information that HRRT deems inappropriate.<br>
        (7) Any action that places an excessive burden on the Service or HRRT's servers, etc.<br>
        (8) Unauthorized access to systems connected to the Service.<br>
        (9) Pretending to be HRRT or another user or third party.<br>
        (10) Interfering with the normal operation of the Service.<br>
        (11) Becoming an antisocial force, etc., or interacting or being involved in any way with antisocial forces, etc., such as cooperating or being involved in the maintenance, operation or management of antisocial forces, etc. through the provision of funds or otherwise.<br>
        (12) Violating any of the provisions of this Agreement.<br>
        (13) Failing to respond to a request for a response to an inquiry from HRRT for 30 days or more.<br>
        (14) Any other act that HRRT deems inappropriate.<br>
        <h4>10 Cancellation of registration, etc.</h4>
        10.1 When HRRT judges that a User has fallen or is likely to fall under any of the items in paragraph 1 of the preceding article or any one of the following items, or when it is necessary for the operation and maintenance of the Service, HRRT may, at its discretion, without any notice, release all or part of the information about Users to the said User. HRRT may take measures such as deletion, temporary suspension or restriction of the Service, or account deletion ("Business Suspension").<br>
        (1) In the event of a violation of the terms of this Agreement, or if HRRT receives a report of such a violation.<br>
        (2) When HRRT receives a disposition such as suspension or cancellation of business from the regulatory authorities.<br>
        (3) If a falsehood is found in all or part of the information provided to HRRT.<br>
        (4) In the event of a seizure, provisional seizure, provisional disposition or tax delinquency.<br>
        (5) If HRRT ceases to pay its bills or becomes insolvent, or a petition for the commencement of bankruptcy proceedings or similar proceedings is filed.<br>
        (6) When it is necessary for the operation and maintenance of the Service or for any other reason similar to the preceding items.<br>
        10.2 HRRT may retain and use the information provided by Users to HRRT even after Users’ account is deleted.<br>
        10.3 In cases where HRRT determines that a User has fallen under any of the items in paragraph 1 of the preceding article or any one of the items in paragraph 1 of this article, or is at risk of falling under any of the items in paragraph 1 of this article, HRRT may request Users to cease the violation, to voluntarily delete or correct the transmitted or published information, etc., and Users shall respond to such request within the period of time specified by HRRT. HRRT shall not be held liable for any disadvantage or damage caused to Users due to the measures taken by HRRT under this Article.<br>
        10.4 HRRT shall not be responsible for any disadvantage or damage caused to Users due to measures taken by HRRT under this Article, unless there is intentional or gross negligence on the part of HRRT in relation to the occurrence of such disadvantage or damage.<br>
        <h4>11 Attribution of Rights</h4>
        11.1 HRRT or its licensors own all the intellectual property rights to all of the content gathered from the Service (all information (including but not limited to text, images, video, audio, music and other sounds, images, software, programs, code and other data) provided by HRRT to Users in the Service. The same applies below).<br>
        11.2 HRRT grants Users the personal use of all Company Content provided by HRRT through the Service to the extent necessary to provide information on candidates for employment or recommenders using the Service, but HRRT does not grant Users any rights other than those explicitly stated in these Terms of Use.<br>
        11.3 Trademarks, logos, service marks, etc. ("Trademarks, etc.") may appear on the Service. However, HRRT shall not transfer or license the use of Trademarks, etc. to users or other third parties.<br>
        <h4>12 Modification, Suspension and Termination of the Service</h4>
        12.1 HRRT may change or add to the contents of the Service in whole or in part without prior notice to Users.<br>
        12.2 HRRT may terminate all or part of the Service at its own discretion by notifying Users in advance by posting a notice on HRRT's website or by any other method deemed appropriate by HRRT. However, in the case of an emergency, HRRT may not give notice to Users.<br>
        12.3 HRRT may temporarily suspend all or part of the Service without prior notice to Users in the event of any of the following events<br>
        (1) In the event of regular or emergency maintenance or repair of the communication equipment and facilities for the Service.<br>
        (2) When the system is overloaded due to excessive access or other unforeseen factors.<br>
        (3) When it is necessary to ensure the security of Users.<br>
        (4) When the services of a telecommunications carrier are not provided.<br>
        (5) In the event that the provision of this service is difficult due to natural disasters such as earthquakes and floods, fires, power outages and other unforeseen accidents, or due to wars, disputes, disturbances, riots, labor disputes, etc.<br>
        (6) In the event that the operation of the Service becomes difficult due to laws and regulations or measures based on these laws and regulations.<br>
        (7) In any other case where HRRT deems it necessary in accordance with the preceding items.<br>
        12.4 HRRT shall not be responsible for any disadvantage or damage caused to Users due to measures taken by HRRT under this Article, unless there is intentional or gross negligence on the part of HRRT.<br>
        <h4>13 Disclaimer of Warranty and Disclaimer of Liability</h4>
        13.1 HRRT may provide all or part of the information obtained from Users to companies seeking candidates for employment or changing jobs, but HRRT does not guarantee that said companies will manage said information appropriately. The information of a candidate who is hired by a company will continue to be retained by the company even after the contract between HRRT and the company expires and HRRT will request the company to destroy the information.<br>
        13.2 HRRT does not warrant that the Service, HRRT's Content and any other information provided through the Service will be suitable for Users’ particular purpose, commercial value, accuracy, usefulness, completeness, legality, conformity to the internal rules and regulations of the organizations that apply to Users, or that there will be no security flaws, errors, bugs or defects in the Service. HRRT does not warrant that the Service does not infringe on the rights of any third party or that there is no such thing as a "third party".<br>
        13.3 HRRT does not guarantee that the Service is compatible with all Information Terminals, and Users acknowledge in advance that malfunctions may occur in the operation of the Service due to upgrades to the OS of the Information Terminals used for the Service. HRRT shall not guarantee that the malfunction will be resolved by HRRT's program modification in the event of such malfunction. 4.<br>
        13.4 If a dispute arises between Users and a third party (including, but not limited to, a candidate for employment, a recommender, or a company seeking employment) in relation to the Service, HRRT shall not be liable for any loss or damage arising from such dispute. Users shall immediately notify HRRT to that effect, and shall resolve the dispute at their own responsibility and expense, with HRRT not being involved in the dispute and assuming no responsibility whatsoever.<br>
        <h4>14 Compensation for damages</h4>
        14.1 In the event of direct or indirect damage to HRRT resulting from a violation of this Agreement or any other use of the Service by a user (including cases where HRRT receives a claim for damages or other demand from a third party due to such an act), Users must compensate HRRT for all damages (including, but not limited to, settlement fees and legal fees, and an amount equivalent to labor costs incurred by HRRT).<br>
        14.2 HRRT shall only be liable for damages caused by violations of this Agreement or other damages resulting from the use of the Service if HRRT has intentionally or through gross negligence caused the damages in question. However, HRRT shall only be liable for direct and ordinary damages that have actually occurred to Users.<br>
        <h4>15 Confidentiality</h4>
        15.1 Except with HRRT's prior written consent, Users may not disclose or provide any information disclosed or provided by HRRT in connection with the Service or the Service (including, but not limited to, the content of any questions asked, the name of the company for which the candidate is seeking employment or changing jobs, the relationship between the candidate and the recommender, etc.("Confidential Information")). HRRT shall treat the Confidential Information as confidential and shall not disclose or provide it to any third party (including the act of disclosing it on social networking services, etc.). However, this does not include cases in which HRRT has obtained its consent, or in which HRRT is compelled by law to disclose or provide the Confidential Information to a third party and HRRT discloses or provides the Confidential Information to the minimum extent necessary.<br>
        15.2 Notwithstanding the preceding paragraph, any information that falls under any of the following categories shall be excluded from the confidential information in the preceding paragraph<br>
        (1) Information that is already public knowledge at the time of disclosure or provision, or information that becomes public knowledge after disclosure or provision through no fault of Users who received the confidential information.<br>
        (2) Users has legitimately obtained the information from a third party without incurring any obligation of confidentiality.<br>
        (3) What Users already has at the time of disclosure or provision.<br>
        15.3 Users must return or destroy the confidential information, any written documents or other storage media that contain or record the confidential information and any copies of such information, whenever requested to do so by HRRT, without delay and in accordance with HRRT's instructions.<br>
        15.4 If Users discloses or provides confidential information to a third party in violation of Article 1, Users shall take immediate action against the violation as designated by HRRT (e.g., deleting the SNS that was disclosed and providing the contact information of the third party to whom the information was provided).<br>
        15.5 The provisions of this Agreement shall remain in effect for a period of two years after the termination of this Agreement.<br>
        <h4>16 Use of Information Provided by Users</h4>
        16.1 HRRT shall properly handle registration information, user information, all communication information on the Service, other information collected from users in relation to the use of the Service ("Member Information, etc.") in accordance with the personal information handling guidelines separately established by HRRT. <br>
        16.2 HRRT may use the information provided by Users, at its discretion, for the purpose of providing and operating the Service, improving and upgrading the Service, understanding the usage of the Service, etc., or as statistical information in a form that cannot identify individuals, to make proposals or consultations to companies, or to develop new services. HRRT may use this information for development and other purposes.<br>
        16.3 HRRT may, to the extent reasonably necessary for the operation of the Service, provide member information, etc. to employers whose candidates for employment are considering employment or changing jobs (however, this is limited to companies notified by HRRT to Users in advance). <br>
        <h4>17 Communication and Notification</h4>
        17.1 Any notice of changes to this Agreement or any other communication from HRRT to Users regarding the Service shall be posted on HRRT's website in an appropriate location, sent via email, or otherwise as deemed appropriate by HRRT. <br>
        17.2 Any inquiry regarding the Service or any other communication or notice from Users to HRRT pursuant to this Agreement shall be sent to the inquiry form located at an appropriate location on HRRT's website or by any other method designated by HRRT.<br>
        <h4>18 Prohibition of Assignment of Rights and Obligations</h4>
        Users cannot transfer all or part of the status under this contract or the rights and obligations based on this contract (including comprehensive succession by merger, company split, etc.) to a third party for the purpose of collateral without the prior written consent of HRRT.<br>
        <h4>19 Handling in case of Business Transfer, etc.</h4>
        In the event that HRRT transfers all or part of its business to another company, HRRT may transfer its position, rights and obligations under this Agreement, as well as member information, etc., to the transferee of such business transfer, etc., and Users shall be deemed to have agreed in advance to such transfer in this Agreement. The business transfer, etc. referred to in this section includes a comprehensive succession through a merger or corporate split in which HRRT becomes an extinct company or a split company.<br>
        <h4>20 Revisions and Changes to this Agreement</h4>
        20.1 HRRT reserves the right to change or add to these Terms of Use at any time at the discretion of HRRT. Unless specified by HRRT, the amended Terms of Use shall be effective from the time it is posted on HRRT's website.<br>
        20.2 In the event of a change in the Terms of Use, HRRT shall announce the details of the change on HRRT's website or in any other way that HRRT deems appropriate, and the change shall take effect at the time of the announcement. In the event that Users use the Service after the announcement of such changes or does not state any objection within the period of time specified by HRRT (if no special period of time is specified, it shall be limited to one month), Users shall be deemed to have agreed to the changes in the Terms of Use.<br>
        <h4>21 Term of this Agreement</h4>
        The term of this Agreement shall be from the date of registration in accordance with Article 3 until the date of deletion of Users’ account.<br>
        <h4>22 Treatment at Termination of Contract</h4>
        22.1 In the event that this Agreement is terminated due to the expiration of the term of this Agreement or any other reason, Users shall not be able to use the Service at all, and shall immediately return all items provided by HRRT (including the service specifications and operation manual) to HRRT or destroy them in accordance with HRRT's instructions.<br>
        22.2 In the event of termination, cancellation or cancellation of this Agreement, Users shall, from that date onwards, store the data downloaded, copied or extracted (in any medium) in connection with the Service in the manner prescribed by law. After that date, Users shall destroy or delete all of the downloaded or copied data and extracted materials (in any medium) in connection with the Service, except for information retained for the purpose of storage as required by law and for which Users has a reasonable basis for retaining at the time of termination, cancellation or cancellation of this Agreement. <br>
        22.3 HRRT may continue to retain, without destroying or deleting, any information obtained from Users through the Service even after this Agreement is terminated, cancelled or terminated. However, HRRT shall destroy or delete all of the information registered by users regarding a candidate for employment, except for information that can be used to identify the fact that the candidate has applied to a particular company and that HRRT has been considering hiring the candidate, unless there is a reasonable basis for retaining such information.<br>
        22.4 Article 4, Paragraph 2, Article 5, Paragraph 2, Article 10, Paragraphs 2 and 4, Article 12, Paragraph 4, Article 13, Paragraphs 1 and 4, Article 14, Article 15, Article 16, Paragraph 2, Article 18, Article 19, this Article, and Articles 23 through 25 shall remain in effect even if this Agreement is terminated, cancelled or rescinded.<br>
        <h4>23 Severability</h4>
        23.1 If any provision of the Terms and Conditions or any part thereof is determined to be invalid or unenforceable, such determination shall not affect the other parts of the Terms and Conditions, and the remaining parts of the Terms and Conditions shall remain valid and enforceable. HRRT and Users agree to comply with the intent of such invalid or unenforceable provision or portion and to be bound by these Terms and Conditions as amended to ensure that they are of equivalent effect.<br>
        23.2 Even if any provision of these Terms and Conditions or part of it is deemed invalid or unenforceable in relation to one user, it shall not affect the validity of the provision in relation to other users.<br>
        <h4>24 Governing Law and Consensus Jurisdiction</h4>
        This Agreement shall be governed by the laws of Japan, and any dispute arising out of or related to this Agreement shall be subject to the exclusive jurisdiction of the Tokyo District Court or the Tokyo Summary Court as the court of first instance, depending on the amount in controversy.<br>
        <h4>25 Negotiated Settlement</h4>
        If any question arises about the interpretation of this Agreement or any matter not stipulated herein, HRRT and Users shall attempt to resolve the matter upon mutual consultation in accordance with the principle of good faith.<br>
        `,
        end: '',
        enactment: 'Enacted September 1, 2020'
      }
    },
    cn: {
      message: {
        text: `
        <h3>利用條約</h3>
        <p>此合約(以下稱「本合約」)是由 株式會社HRRT「該社」)所提供的背景調查及良民確認的服務總稱「MiKiWaMe Point」(服務內容或名稱如有變更包含該服務，以下稱「本服務」)，錄取候選者或是作答者(以下稱「使用者」）間的權利義務關係相關之內容。再利用本服務前，請詳讀合約內容，並同意進而可使用本服務。</p>
        <h4>第1條(本合約的目的及適用)</h4>
        1.本合約是該社提供本服務給使用者前所需確認的基本契約(同意合約內容並使用本服務的利用者，以下將稱「使用服務者」和該合約則稱「本合約」)。以制定該社和使用者的權利義務關係作為目的。<br>
        2.本社，以書面或電子郵件或本社網頁(mikiwame-p.jp(無論任何理由，該網頁網址有任何變更後也同樣在內)記載之本服務相關的個別規定或追加規定(以下稱「個別規定等」)如和本合約衝反的話，將優先個別規定。另外本合約如改訂或變更將適用於第20條。<br>
        <h4>第2條(定義)</h4>
        1.「錄取候選者」是指，就職活動或轉職活動中的求職者。<br>
        2.「作答者」是指，應徵職缺的候選者透過本服務提供己身情報來源的人物。<br>
        3.「使用服務者」是指，本服務的利用人。<br>
        <h4>第３條(登記)</h4>
        1.使用服務者同意遵守合約內容，並提供該社制定的情報(以下稱「登記情報」)便能申請登記使用服務。<br>
        2.該社將對使用服務者在登記過程中有有另外制定的審查基準時候會另行做通知。<br>
        3.前項狀況，該社可能提出審查所需的文件，使用服務者則須迅速回覆該文件。如使用服務者不回覆文件或是不足以達到該社所需的審查基準時候，該社可拒絕使用服務者使用該服務。<br>
        4.該社除了前項之外，根據第1項登記的使用服務者如符合以下幾個事項可拒絕登記使用該服務。<br>
        （1）提供至該社的情報的全部或是部分有與事實不符或誤實或遺漏的情形。<br>
        （2）當使用服務者本人因法定資格不足或不符合使用本合約情形。<br>
        （3）使用服務者先前已登記過該服務且收到帳號停用或是停用服務等場合。<br>
        （4）使用服務者被判定為反社會團體(暴力團，黑道，右派團體，反射匯勢力，或符合以上條件者皆為是)。或者資金提供反社會勢力，牽扯於團體的維持或運作或是經營等交流者。或該社判定使用服務者過去曾屬以上團體的情形。<br>
        （5）其他，該社判斷不適合登記的情形。<br>
        <h4>第４條(登記情報的提供和變更)</h4>
        1.服務使用者在情報的登記時，必須要填寫真實且正確的情報，不違反個人情報保護法等法令，規則之內容)。如登記情報有誤時候服務使用者必續迅速更正內容。<br>
        2.該社，會依照使用服務者提供的情報進而去提供該服務。如登記的情報有錯誤或是遺漏導致使用服務者有任何損失時候該社不負一切責任<br>
        3.使用服務者因未能即時修正登記情報導致該社無法正常提供服務和通知，該服務和通知將視為正常通知。<br>
        <h4>第５條 (帳號的管理)</h4>
        1.使用服務者，必須責任的管理和保管己身的帳號，不得讓第三者使用或借貸或給予，名義變更，買賣等行為。<br>
        2.如失守於帳號管理，使用上的過失，第三者的使用導致服務使用者損失，該社將不進行一切責任的負責。<br>
        3.使用服務者如發現帳號被盜用或第三者使用等情形時候必須立即告知該社，並遵守該社的指示。<br>
        4.該社判斷使用服務者已達到服務利用完成時候，將立即刪除使用者的帳號。<br>
        <h4>第６條 (宣示保證)</h4>
        1.使用服務者保證使用該服務時候，將誠實的回答質問，依照己身經驗和知識正確的回答，並不作虛假的回答。<br>
        2.使用服務者保證不對作答者要求虛假的作答或是妨礙作答，而作答者必須對該服務的質問回答時用己身的經驗和知識做出正確的回答。<br>
        <h4>第７條 (該服務的利用)</h4>
        1.使用服務者在該合約範圍內，遵守該社制定的方法便能使用本服務。<br>
        2.使用服務者在該社提供便能利用本服務，但無法複製，修正，變更，改變或翻案。另外得遵守該社制定的條件做使用。<br>
        3.使用服務者不得直接或間接的將本服務提供給第三者做使用。<br>
        4.本服務使用時候所需的電腦，軟體，其他機器和通訊裝置環境設備皆由使用服務者的責任和自費去準備。<br>
        <h4>第８條 (本服務的使用費用)</h4>
        使用服務者除非和該設有另外協議等狀況外，無須對本服務支付服務的使用費用。<br>
        <h4>第9條 (禁止事項)</h4>
        使用服務者在使用本服務之時，禁止己身或對第三者做以下行為。以及，不可直接性或間接性的導致以下情形。<br>
        （1）不可對該社，錄取候選者，作答者或第三者毀謗或汙辱，詐欺或威脅行為或做虛假的情報的提供<br>
        （2）不可在SNS等社群網站公開該服務或是該服務關聯的一切資訊<br>
        （3）對錄取候選者，作答者或企業做出不誠實的行為<br>
        （4）不可做出對該社或錄取候選者或作答者或企業的侵權或損害利益等各種行為<br>
        （5）誘使本服務誤作用的行為<br>
        （6）符合以下或是該社判斷提供的情報符合以下的情形<br>
        ①誘使自殺，自傷等行為，或助長誘導等表現的情報<br>
        ②危險藥物等買賣相關的情報或是助長蔓延危險藥物的流通的情報<br>
        ③宣導宗教，宗教團體，政治活動，政治團體的廣告和情報<br>
        ④殘暴或色情的表現或令人不悅的內容和情報<br>
        ⑤流通電腦病毒等有害程式的情報<br>
        ⑥其他該社判斷不適當內容情報<br>
        （7）過度負荷本服務或該社伺服器的行為<br>
        （8）無權限不正當的連結本服務系統等行為<br>
        （9）假冒該社或是其他第三者等行為<br>
        （10）妨害本服務正常運作的一切行為<br>
        （11）助長反社會團體或是提供資金給反社會勢力的維持或運作或經營，或者關係於反社會的一切交流行為<br>
        （12）違反本合約任何一條項目的行為<br>
        （13）30天以上對該社的聯絡而沒有回覆的行為<br>
        （14）其他該社判段不適當的行為<br>
        <h4>第10條 (取消登記)</h4>
        1.該社判斷使用服務者符合前條第1項或以下各項時候，可由該社的決定不進行任何通知停止或限制或是刪除帳號的措施。(以下稱「停止服務」)<br>
        （1）違反本合約，或被通報違反的情形<br>
        （2）相關單位發布停止服務或取消處分的情形<br>
        （3）發現提供該社的情報的全部或部分有虛假的情形<br>
        （4）扣押，或稅金的未繳的情形<br>
        （5）停止支付或是支付不能，或是進行破產手續等情形支<br>
        （6）運作本服務或管理上遇到前述的事由的情形<br>
        2.該社在刪除利用者帳號後也能保由使用服務者提供的情報的利用和保管。<br>
        3.該社發現使用服務者有違反合約行為時候，可停止或要求情報的刪除或是修正，使用服務者必須限期內做回覆。<br>
        4.該社，如非刻意或是沒有重大過失的情形，在本服務造成使用服務者的不利抑或是損害將不進行一切的責任保證。<br>
        <h4>第11條 (權利歸屬)</h4>
        1.本服務及本服務內的該社的內容(該社在本服務提供的一切情報(文章，圖像，影片，音檔，音樂，圖檔，軟體，程式，其他任何資訊)，以下皆是)將歸屬於該社或是該社許可之對象所擁權利的歸屬。<br>
        2.該社允許透由本服務該社所提供的內容將在錄取候選者和作答者在必要的範圍內的使用，但本合約之外則不認同該其權利。<br>
        3.本服務的商標，標誌等(以下總稱「商標等」)會在服務上出現，但該社並非同意商標等讓給或服務使用者和第三者利用。<br>
        <h4>第12條 (本服務的變更，中斷，停止)</h4>
        1.該社可對服務使用者不進行任何通知並且改變部分或是全部或是追加內容。<br>
        2.該社在服務上有變更的情形時候將在網頁上通知或是該設判斷的方法進行通知，也可該社的判斷停止服務。且緊急的狀況下可不需通知服務使用者。<br>
        3.該社在發現以下項目情形時候，可以無需通知使用服務者中段部分或是全部的服務。<br>
        （1）本服務緊急需要做通訊設備等維修或是修理的情形<br>
        （2）系統受到過度負荷的情形<br>
        （3）必須要確保使用服務者的資料保護的情形 <br>
        （4）電氣通信事業者將無法完成該者的義務的情形<br>
        （5）地震，水災等天災，火災，停電或其他無法預知的事故，戰爭，紛爭，動亂，暴動，罷工導致無法提供本服務的情形。<br>
        （6）法令的限制使得無法運作本服務的情形<br>
        （7）其他該社判段的情形<br>
        4.該社，如非刻意或是沒有重大過失的情形，在本服務造成使用服務者的不利抑或是損害將不進行一切的責任保證。<br>
        <h4>第13條 (保證的否認和免責)</h4>
        1.該社將對錄取候選者對就職或是轉職目標的企業提供部分或是全部的情報，但不保證該企業是否適當的管理其情報。而該候選者在是否錄取企業，企業是否會管理或是遺棄該情報也不在該社的保證範圍內。<br>
        2.該社在本服務或透過本服務提供的內容的一切情報，適當性，商用價值，正確性，有用性，完全性，適法性，對安全上的缺陷，錯誤，不侵害第三者權利等一切不再該社的保證範圍。<br>
        3.該社不保證本服務在所有的設備可使用，本服務再利用之際系統的升級時候可能產生的不良狀況，視為使用者事先已同意。該社將進行問題的解決但不保證問題的解決<br>
        4.本服務的使用服務者和第三者(錄取候選者，作答者，企業，以及其他)之間發生了糾爭，服務使用者必須盡速告知，並以己身的責任和費用負擔去解決問題。該社對此不做任何干涉和責任的保證。<br>
        <h4>第14條 (損害求償)</h4>
        1.使用服務者在本合約有違反的行為導致該社直接或間接的損害的情形(包含此行為使得第三者向該社求款損害賠償等情形)，使用服務者對該社的所有損害(解決金，官司費用，該件事情的人事費，包含其他費用)需做賠償。<br>
        2.該社違反本合約或本服務的利用起因而造成使用服務者損害時候，如是故意或是重大過失等情形將進行負責，但該負範圍僅限使用服務者所受之直接性的損害。<br>
        <h4>第15條 (秘密保持)</h4>
        1.使用服務者除了該社事先的書面承諾場合之外，本服務或是關聯本服務的該社公開的或提供的情報(包含質問內，錄取候選者，就職或是轉職企業的名稱或是錄取候選者和作答者的關係，以下稱「秘密情報」。) 將嚴格管理資訊，且不能對第三者公開或提供(包含SNS上公開)。但規社同意或被迫必須提供等情形之下可公開或提供最少必要範圍。<br>
        2.不論前項，符合以下各項的情報將不列入秘密情報。<br>
        （1）公開或提供時候已是公開的，或不在情報提供或受方的責任範圍內的情報<br>
        （2）使用服務者不負秘密保持義務的從第三者方正當入手的情報<br>
        （3）公開或提供時候使用服務者已經保有的情報<br>
        3.使用服務者被該社要求時候必須不延誤的將第一項秘密情報和紀載開情報的書面或其他媒體和複製物做歸還或是廢棄。<br>
        4.使用服務者必續迅速去對應違反第一項時候(在SNS上公開則刪除，告知提供情報的第三者的聯絡方法)。<br>
        5.本條規定在合約終了後持有2年的效力。<br>
        <h4>第16條 (使用服務者提供的情報的利用)</h4>
        1.該社將從作答者或是使用服務者得取的情報，使用服務者在本服務上的一切情報或從服務上收到的情報 (以下稱「會員情報等」)將妥善保管適當的使用。<br>
        2.該社，將使用服務者所提供的情報將用於服務內容的改良和改善，在保持無法追朔到個人資訊為前提之下可做統計或行銷或新服務的開發等其他目的座使用。当<br>
        3.該社，在運作本服務事業時，合理且必要的範圍內可將會員情報提供給就職或轉職企業或徵人中企業(但僅限事先有介紹給使用服務者的公司)。<br>
        <h4>第17條 (聯絡・通知)</h4>
        1.本合約有內容如有變更將在該社網頁上適時的通知，或由郵件方式等該社認為合適方式去做通知<br>
        2.關於本服務的詢問或是其他合約的詢問皆由該社網頁內所設置的詢問方式或該社指定方法進行詢問。<br>
        <h4>第18條 (禁止權利義務轉讓)</h4>
        使用服務者沒有該社的書面上允許的情形下將本合約的權利義務的全部或部分轉讓給第三者(合併，公司分割等繼承皆是)，也不能將合約作為擔保使用。<br>
        <h4>第19條 (事業轉讓的情況)</h4>
        該社如將該服務的部分或全部轉給他社的情形，在此合約時已視為使用服務者已同意該社轉讓權利，義務，會員情報等事項。包含該社消滅分割公司或合併公司等狀況情形。<br>
        <h4>第20條 (本合約的改訂・變更)</h4>
        1.該社判斷的情況下隨時可改定本合約內容或變更。變更後的利用條約除了該社另有制定的場合之外，將公開在網頁上即開始產生效力。<br>
        2.該社變更合約內容將公開在網頁上視為適當的效力的產生。如內容變更且公開後使用服務者對該社制定內容無異議時候(如沒有特設期間則為1個月內)則視為使用服務者同意合約的變更。<br>
        <h4>第21條 (本合約的有效期間)</h4>
        本合約的有效期間為，根據第３條的登記日開始，至使用服務者的帳號刪除為止。<br>
        <h4>第22條 (合約結束時的處裡)</h4>
        1.本合約在滿約結束或是其他原因而終了的情形時候，使用服務者將無法使用該服務。此時必須歸還設提供的一切物品(本服務的書面說明書等)或遵守該社的要求迅速遺棄並將該遺棄內容向該社證明。<br>
        2.本合約終了，解除，或解約等情形，使用服務者必須全數遺棄或是刪除該服相關的資訊包含下載，複製的檔案，資料(無論媒體形式)。如使用服務者沒有合理的法定根據時候必須全數遺棄或是刪除。<br>
        3.本合約終了，解除或解約的情形時候，該社從本服務得取的情報可不做刪除或遺棄可持有。但，該社必須將徵人中企業在檢討特定個人的錄取情報等在沒有合理的法定根據時候必須全數遺棄或是刪除。<br>
        4.即使本合約終了，解除或解約時候，第４條第2項、第５條第2項、第10條第2項及第4項、第12條第4項、第13條第1項及第4項、第14條、第15條、第16條第2項、第18條、第19條、及本條和第23條至第25條仍有效力。<br>
        <h4>第23條 (分離的可能性)</h4>
        1.本合約的任一項或部分內容被判為無效或無法執行時候，該判定不影響他條，他條則持續保有效力。該社和使用服務者對被判定無效或無法執行的條例內容時候則遵守並同意修正過後的同等效力的新法條。<br>
        2.本合約的任一項或部分因其一使用服務者的關係而無效或是無法執行時候對其他使用服務者則不影響而繼續保有其有效性。<br>
        <h4>第24條 (根據法及同意範圍)</h4>
        本合約根據日本法，因本合約的起因或一切紛爭皆由東京地方裁判所獲東京簡易裁判所做為第一審的管轄裁判所。<br>
        <h4>第25條 (協議解決)</h4>
        該社及使用服務者在本合約沒有涉及的事項或合約的解釋有差異時候，將以誠心誠意的原則之下，協議並且一同解決問題。<br>
        `,
        end: '以上',
        enactment: '2020年9月1日制定'
      }
    }
  }
}

Vue.use(VueI18n)

export const getI18n = (val) => new VueI18n({
  locale: 'jp',
  messages: messages[val]
})

export const getAllI18n = new VueI18n({
  locale: 'jp',
  messages
})
