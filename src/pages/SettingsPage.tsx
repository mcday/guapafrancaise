import { useState, useEffect } from 'react'
import { Eye, EyeOff, Volume2, Globe, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '@/stores/useSettingsStore'
import type { AIProviderType } from '@/types/settings'

export function SettingsPage() {
  const settings = useSettingsStore()
  const [showClaudeKey, setShowClaudeKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    function loadVoices() {
      const allVoices = speechSynthesis.getVoices()
      const frenchVoices = allVoices.filter(
        (v) => v.lang.startsWith('fr')
      )
      setVoices(frenchVoices.length > 0 ? frenchVoices : allVoices.filter(v => v.lang.startsWith('fr') || v.lang.startsWith('en')))
    }
    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const providers: { value: AIProviderType; label: string }[] = [
    { value: 'claude', label: 'Claude (Anthropic)' },
    { value: 'gemini', label: 'Gemini (Google)' },
  ]

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-8 max-w-5xl mx-auto space-y-6">
      <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-800">Réglages</h2>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">

      {/* AI Provider */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-quebec-500" />
          <h3 className="font-display font-semibold text-gray-700">Fournisseur IA</h3>
        </div>

        <div className="flex gap-2">
          {providers.map((p) => (
            <button
              key={p.value}
              onClick={() => settings.setAiProvider(p.value)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                settings.aiProvider === p.value
                  ? 'bg-quebec-500 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Claude API Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Clé API Claude</label>
          <div className="relative">
            <input
              type={showClaudeKey ? 'text' : 'password'}
              value={settings.claudeApiKey}
              onChange={(e) => settings.setApiKey('claude', e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 pr-10 text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-quebec-300 focus:border-transparent font-mono"
            />
            <button
              onClick={() => setShowClaudeKey(!showClaudeKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Clé API Gemini</label>
          <div className="relative">
            <input
              type={showGeminiKey ? 'text' : 'password'}
              value={settings.geminiApiKey}
              onChange={(e) => settings.setApiKey('gemini', e.target.value)}
              placeholder="AIza..."
              className="w-full bg-gray-50 rounded-xl px-3 py-2.5 pr-10 text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-quebec-300 focus:border-transparent font-mono"
            />
            <button
              onClick={() => setShowGeminiKey(!showGeminiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.section>

      {/* Voice Settings */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-terracotta-500" />
          <h3 className="font-display font-semibold text-gray-700">Voix et audio</h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Voix française</label>
          <select
            value={settings.ttsVoiceURI}
            onChange={(e) => settings.setTTSVoice(e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-3 py-2.5 text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-quebec-300"
          >
            <option value="">Voix par défaut</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Vitesse : {settings.ttsRate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.ttsRate}
            onChange={(e) => settings.setTTSRate(parseFloat(e.target.value))}
            className="w-full accent-terracotta-500"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Lent</span>
            <span>Normal</span>
            <span>Rapide</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Effets sonores</span>
          <button
            onClick={settings.toggleSound}
            className={`w-12 h-6 rounded-full transition-all ${
              settings.soundEnabled ? 'bg-turquoise-400' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </motion.section>

      {/* Language Settings */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-4"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gold-500" />
          <h3 className="font-display font-semibold text-gray-700">Langue</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Aide en espagnol</p>
            <p className="text-[11px] text-gray-400">Tooltips et traductions</p>
          </div>
          <button
            onClick={settings.toggleSpanishHints}
            className={`w-12 h-6 rounded-full transition-all ${
              settings.showSpanishHints ? 'bg-turquoise-400' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                settings.showSpanishHints ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Niveau par défaut</label>
          <div className="flex gap-2">
            {(['A2', 'B1', 'B1+', 'B2'] as const).map((level) => (
              <button
                key={level}
                onClick={() => settings.setDefaultDifficulty(level)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                  settings.defaultDifficulty === level
                    ? 'bg-terracotta-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </motion.section>
      </div>
    </div>
  )
}
