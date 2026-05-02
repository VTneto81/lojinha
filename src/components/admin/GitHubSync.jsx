import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Github, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function GitHubSync() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke("syncToGithub", {});
      setResult(res.data);
      toast.success("Sincronizado com GitHub!");
    } catch (err) {
      toast.error("Erro ao sincronizar com GitHub");
      setResult({ success: false, summary: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center"><Github className="w-5 h-5 text-white" /></div>
          <div><h3 className="font-extrabold text-gray-800">GitHub Sync</h3><p className="text-xs text-gray-400">Exportar código para VTneto81/lojinha</p></div>
        </div>
        <a href="https://github.com/VTneto81/lojinha" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold">Ver repositório <ExternalLink className="w-3 h-3" /></a>
      </div>
      <button onClick={handleSync} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Sincronizando..." : "🚀 Sincronizar com GitHub"}
      </button>
      {result && (
        <div className={`mt-4 rounded-xl p-4 ${result.success !== false ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-center gap-2 mb-1">
            {result.success !== false ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
            <p className={`text-sm font-bold ${result.success !== false ? "text-green-700" : "text-red-600"}`}>{result.summary}</p>
          </div>
          {result.repo_url && <a href={result.repo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-semibold">{result.repo_url}</a>}
          {result.recent_commits?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-gray-600 mb-1">Últimos commits:</p>
              {result.recent_commits.slice(0, 3).map((c, i) => (
                <div key={i} className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <code className="bg-white px-1.5 py-0.5 rounded border text-gray-700">{c.sha}</code>
                  <span className="truncate">{c.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}