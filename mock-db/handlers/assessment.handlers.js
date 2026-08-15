const db = require('../db')
const { uuid, now, listMeta } = require('../helpers')

function calcAssessmentResult(answers) {
  const total = answers.reduce((sum, a) => sum + (a.values[0] ?? 0), 0)
  if (total <= 4) {
    return {
      score: total,
      level: 'low',
      summary: 'Değerlendirmenize göre kaygı düzeyiniz minimal görünmektedir. Günlük yaşam kalitenizi korumaya devam etmeniz önerilir.',
      suggestions: [
        'Düzenli fiziksel aktivite yapın (haftada en az 3 gün, 30 dakika)',
        'Uyku düzeninize dikkat edin',
        'Mindfulness veya nefes egzersizleri deneyin',
      ],
    }
  }
  if (total <= 9) {
    return {
      score: total,
      level: 'moderate',
      summary: 'Değerlendirmenize göre orta düzeyde kaygı belirtileri gözlemlenmektedir. Bir uzmanla görüşmeniz faydalı olabilir.',
      suggestions: [
        'Kaygı tetikleyicilerinizi bir günlük tutarak takip edin',
        'Derin nefes ve gevşeme tekniklerini öğrenin',
        'Kafein ve alkol tüketimini azaltın',
        'Bir psikolog ile en az birkaç seans değerlendirme yapın',
      ],
    }
  }
  return {
    score: total,
    level: 'high',
    summary: 'Değerlendirmenize göre belirgin kaygı belirtileri tespit edilmektedir. Bir uzmandan destek almanız önerilir.',
    suggestions: [
      'En kısa sürede bir klinik psikolog veya psikiyatrist ile görüşün',
      'Bilişsel Davranışçı Terapi (BDT) için uzman desteği alın',
      'Günlük rutininizde stres azaltıcı aktivitelere yer açın',
      'Yakın çevrenizle duygularınızı paylaşmaktan çekinmeyin',
    ],
  }
}

function registerAssessmentHandlers(mock) {
  mock.onGet('/assessment/results/my').reply(() => {
    const sorted = db.assessmentResults
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return [200, { data: sorted, meta: listMeta(sorted) }]
  })

  mock.onGet(/\/assessment\/results\/[\w-]+$/).reply((config) => {
    const id = config.url.split('/').pop()
    const result = db.assessmentResults.find((r) => r.id === id)
    if (!result) return [404, { code: 'RESULT_NOT_FOUND', message: 'Test sonucu bulunamadı.' }]
    return [200, result]
  })

  mock.onGet('/assessment/active').reply(() => [200, db.assessment[0]])

  mock.onGet('/assessment').reply((config) => {
    const category = config.params?.category ?? ''
    let result = db.assessment
    if (category) result = result.filter((a) => a.category === category)
    return [200, {
      data: result.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        estimatedMinutes: a.estimatedMinutes,
        questionCount: a.questions.length,
      })),
    }]
  })

  mock.onPost('/assessment/submit').reply((config) => {
    const { answers } = JSON.parse(config.data)
    const result = { id: uuid(), ...calcAssessmentResult(answers), createdAt: now() }
    db.assessmentResults.push(result)
    return [200, result]
  })
}

module.exports = { registerAssessmentHandlers }
