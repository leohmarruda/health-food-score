'use client';

interface HFSScoresModalProps {
  isOpen: boolean;
  scores: {
    S1?: number; // Açúcares
    S2?: number; // Fibras
    S3?: number; // Perfil de gorduras
    S4?: number; // Densidade calórica
    S5?: number; // Proteína
    S6?: number; // Sódio
    S7?: number; // Grau de processamento
    S8?: number; // Aditivos
  };
  totalScore?: number;
  servingSize?: number;
  servingUnit?: string;
  density?: number;
  onClose: () => void;
  dict?: any;
}

export default function HFSScoresModal({
  isOpen,
  scores,
  totalScore,
  servingSize,
  servingUnit,
  density,
  onClose,
  dict
}: HFSScoresModalProps) {
  if (!isOpen) return null;

  const t = dict?.hfsScores || {};

  const scoreLabels = [
    { key: 'S1', label: t.S1 || 'Açúcares (S1)', value: scores.S1 },
    { key: 'S2', label: t.S2 || 'Fibras (S2)', value: scores.S2 },
    { key: 'S3', label: t.S3 || 'Perfil de gorduras (S3)', value: scores.S3 },
    { key: 'S4', label: t.S4 || 'Densidade calórica (S4)', value: scores.S4 },
    { key: 'S5', label: t.S5 || 'Proteína (S5)', value: scores.S5 },
    { key: 'S6', label: t.S6 || 'Sódio (S6)', value: scores.S6 },
    { key: 'S7', label: t.S7 || 'Grau de processamento (S7)', value: scores.S7 },
    { key: 'S8', label: t.S8 || 'Aditivos (S8)', value: scores.S8 },
  ];

  const formatScore = (score: number | undefined) => {
    if (score === undefined || score === null) return '—';
    return score.toFixed(1);
  };

  const getScoreColor = (score: number | undefined) => {
    if (score === undefined || score === null) return 'text-text-main/40';
    if (score >= 4) return 'text-green-600';
    if (score >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-text-main/10 overflow-hidden transform animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-text-main">
              {t.title || 'HFS Scores'}
            </h3>
            <button
              onClick={onClose}
              className="text-text-main/60 hover:text-text-main text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-text-main/10 transition"
            >
              ×
            </button>
          </div>

          {totalScore !== undefined && totalScore !== null && (
            <div className="mb-3 p-3 bg-primary/10 border-2 border-primary/20 rounded-theme">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-text-main">
                  {t.totalScore || 'Total HFS Score'}
                </span>
                <span className={`text-2xl font-black ${getScoreColor(totalScore)}`}>
                  {formatScore(totalScore)}
                </span>
              </div>
            </div>
          )}

          {(servingSize !== undefined || servingUnit || density !== undefined) && (
            <div className="mb-3 p-2 bg-background rounded-theme border border-text-main/10">
              <h4 className="text-xs font-bold text-text-main/60 mb-2 uppercase">
                {t.portionInfo || 'Portion Information'}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {servingSize !== undefined && servingSize !== null && (
                  <div>
                    <span className="text-xs text-text-main/60 block mb-0.5">
                      {t.servingSize || 'Serving Size'}
                    </span>
                    <span className="text-sm font-medium text-text-main">
                      {servingSize}
                    </span>
                  </div>
                )}
                {servingUnit && (
                  <div>
                    <span className="text-xs text-text-main/60 block mb-0.5">
                      {t.servingUnit || 'Serving Unit'}
                    </span>
                    <span className="text-sm font-medium text-text-main">
                      {servingUnit}
                    </span>
                  </div>
                )}
                {density !== undefined && density !== null && density !== 0 && (
                  <div>
                    <span className="text-xs text-text-main/60 block mb-0.5">
                      {t.density || 'Density'}
                    </span>
                    <span className="text-sm font-medium text-text-main">
                      {typeof density === 'number' ? density.toFixed(2) : density}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <h4 className="text-xs font-bold text-text-main/60 mb-2 uppercase">
            {t.parametersSubtitle || 'Parâmetros (calculados para 100g)'}
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {scoreLabels.map(({ key, label, value }) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 bg-background rounded-theme border border-text-main/10"
              >
                <span className="text-xs font-medium text-text-main/80">{label}</span>
                <span className={`text-base font-bold ${getScoreColor(value)}`}>
                  {formatScore(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-3 bg-text-main/5 border-t border-text-main/10">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-theme font-bold text-sm text-white bg-primary hover:opacity-90 transition shadow-lg"
          >
            {dict?.common?.close || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

