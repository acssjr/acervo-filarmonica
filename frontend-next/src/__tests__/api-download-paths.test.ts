import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock Storage module
vi.mock("@lib/storage", () => ({
  default: {
    get: vi.fn((key: string) => {
      if (key === "authToken") return "test-jwt-token";
      if (key === "tokenExpiresAt") return Date.now() + 86400000;
      return null;
    }),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock API_BASE_URL - always empty to simulate localhost / proxy behavior
vi.mock("@constants/api", () => ({
  API_BASE_URL: "",
  TOKEN_EXPIRY_SECONDS: 86400,
  TOKEN_EXPIRY_BUFFER_MS: 300000,
}));

import { API } from "@lib/api";

describe("API Download URL Methods", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["pdf-content"], { type: "application/pdf" })),
      headers: new Headers({ "Content-Type": "application/pdf" }),
    });
    global.fetch = mockFetch as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getDownloadUrl", () => {
    it("should return a relative URL without API_BASE_URL prefix", () => {
      const url = API.getDownloadUrl("123");
      // Should be relative (starts with /) so it goes through Next.js proxy
      expect(url).toBe("/api/download/123");
    });

    it("should include instrumento as query param when provided", () => {
      const url = API.getDownloadUrl("123", "Trompete Bb");
      expect(url).toBe("/api/download/123?instrumento=Trompete Bb");
    });

    it("should return URL without instrumento param when null", () => {
      const url = API.getDownloadUrl("123", null);
      expect(url).toBe("/api/download/123");
    });
  });

  describe("getRepertorioDownloadUrl", () => {
    it("should return a relative URL for repertorio download", () => {
      const url = API.getRepertorioDownloadUrl("5", null, "pdf");
      expect(url).toBe("/api/repertorio/5/download?formato=pdf");
    });

    it("should include instrumento when provided", () => {
      const url = API.getRepertorioDownloadUrl("5", "Clarinete Bb", "pdf");
      expect(url).toContain("instrumento=Clarinete%20Bb");
      expect(url.startsWith("/api/repertorio/5/download")).toBe(true);
    });

    it("should include partituraIds when provided", () => {
      const url = API.getRepertorioDownloadUrl("5", null, "pdf", [1, 2, 3]);
      expect(url).toContain("partituras=1,2,3");
    });
  });

  describe("downloadBlob - authenticated download via fetch+blob", () => {
    it("should exist as an async method on API", () => {
      expect(typeof API.downloadBlob).toBe("function");
    });

    it("should fetch the download URL with Authorization header", async () => {
      await API.downloadBlob("/api/download/parte/42");

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/download/parte/42",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-jwt-token",
          }),
        })
      );
    });

    it("should return a blob on success", async () => {
      const result = await API.downloadBlob("/api/download/parte/42");

      expect(result).toBeInstanceOf(Blob);
    });

    it("should throw on non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: "Nao autorizado" }),
      });

      await expect(API.downloadBlob("/api/download/parte/42")).rejects.toThrow();
    });

    it("should throw on network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(API.downloadBlob("/api/download/parte/42")).rejects.toThrow("Network error");
    });
  });

  describe("getModoRecesso", () => {
    it("should use relative URL (no API_BASE_URL prefix)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ativo: false }),
      });

      await API.getModoRecesso();

      // Should call fetch with relative URL for proxy
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toBe("/api/config/recesso");
    });

    it("should NOT use raw fetch without options (should go through this.request for consistency)", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ativo: false }),
      });

      await API.getModoRecesso();

      // When using this.request(), fetch is called with headers including Content-Type
      // Raw fetch() is called with just the URL (no second arg)
      // We want it to go through this.request() so auth headers are included
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs.length).toBeGreaterThanOrEqual(2);
      expect(callArgs[1]).toBeDefined();
      expect(callArgs[1].headers).toBeDefined();
    });
  });
});

describe("Direct fetch calls should use relative URLs", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
      blob: () => Promise.resolve(new Blob()),
    });
    global.fetch = mockFetch as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("createPartitura should use /api/partituras (relative)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });
    const formData = new FormData();
    await API.createPartitura(formData);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toBe("/api/partituras");
  });

  it("uploadPastaPartitura should use relative URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });
    const formData = new FormData();
    await API.uploadPastaPartitura(formData);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toBe("/api/partituras/upload-pasta");
  });

  it("addPartePartitura should use relative URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });
    const formData = new FormData();
    await API.addPartePartitura("10", formData);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toBe("/api/partituras/10/partes");
  });

  it("replacePartePartitura should use relative URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });
    const formData = new FormData();
    await API.replacePartePartitura("10", "5", formData);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toBe("/api/partes/5/substituir");
  });

  it("uploadFotoPerfil should use relative URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ url: "photo.jpg" }),
    });
    const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
    await API.uploadFotoPerfil(file);
    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl).toBe("/api/perfil/foto");
  });
});
