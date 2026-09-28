const EcoGeo = require('../../public/js/geo');

const SAO_PAULO = { latitude: -23.5505, longitude: -46.6333 };
const RIO = { latitude: -22.9068, longitude: -43.1729 };

describe('EcoGeo.distanciaKm', () => {
  it('deve retornar 0 para o mesmo ponto', () => {
    expect(EcoGeo.distanciaKm(SAO_PAULO, SAO_PAULO)).toBe(0);
  });

  it('deve calcular a distância em linha reta entre São Paulo e Rio de Janeiro (~360 km)', () => {
    const km = EcoGeo.distanciaKm(SAO_PAULO, RIO);

    expect(km).toBeGreaterThan(350);
    expect(km).toBeLessThan(365);
  });

  it('deve ser simétrica', () => {
    expect(EcoGeo.distanciaKm(SAO_PAULO, RIO)).toBeCloseTo(EcoGeo.distanciaKm(RIO, SAO_PAULO), 6);
  });
});

describe('EcoGeo.formatarDistancia', () => {
  it.each([
    [0.85, '850 m'],
    [0.996, '1 km'],
    [3.24, '3,2 km'],
    [12.7, '12,7 km'],
    [357.4, '357 km'],
  ])('deve formatar %s km como "%s"', (km, esperado) => {
    expect(EcoGeo.formatarDistancia(km)).toBe(esperado);
  });
});

describe('EcoGeo.temCoordenadas', () => {
  it('deve exigir latitude e longitude numéricas', () => {
    expect(EcoGeo.temCoordenadas(SAO_PAULO)).toBe(true);
    expect(EcoGeo.temCoordenadas({ latitude: null, longitude: null })).toBe(false);
    expect(EcoGeo.temCoordenadas({ latitude: -23.5 })).toBe(false);
  });
});
