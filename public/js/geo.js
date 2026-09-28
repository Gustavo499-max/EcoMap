// Funções de geolocalização sem dependência do DOM.
// Funciona no navegador (window.EcoGeo) e no Node (require), para permitir testes.
(function (raiz, fabrica) {
  if (typeof module === "object" && module.exports) {
    module.exports = fabrica();
  } else {
    raiz.EcoGeo = fabrica();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const RAIO_TERRA_KM = 6371;

  const paraRadianos = (graus) => (graus * Math.PI) / 180;

  function temCoordenadas(ponto) {
    return Number.isFinite(ponto.latitude) && Number.isFinite(ponto.longitude);
  }

  // Distância em linha reta entre dois pontos (fórmula de Haversine), em km.
  function distanciaKm(origem, destino) {
    const dLat = paraRadianos(destino.latitude - origem.latitude);
    const dLon = paraRadianos(destino.longitude - origem.longitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(paraRadianos(origem.latitude)) *
        Math.cos(paraRadianos(destino.latitude)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * RAIO_TERRA_KM * Math.asin(Math.sqrt(Math.min(1, a)));
  }

  // 0,85 -> "850 m" | 3,24 -> "3,2 km" | 357,4 -> "357 km"
  function formatarDistancia(km) {
    const metros = Math.round((km * 1000) / 10) * 10;

    if (metros < 1000) {
      return `${metros} m`;
    }

    const casas = km < 100 ? 1 : 0;

    return `${km.toLocaleString("pt-BR", { maximumFractionDigits: casas })} km`;
  }

  return { temCoordenadas, distanciaKm, formatarDistancia };
});
