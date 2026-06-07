import { describe, it, expect } from "vitest";
import { isBlockedIp, assertPublicUrl, SsrfBlockedError } from "./safe-fetch";

describe("isBlockedIp — IPv4", () => {
  const blocked = [
    "0.0.0.0",
    "10.0.0.1",
    "10.255.255.255",
    "127.0.0.1",
    "127.1.2.3",
    "169.254.169.254", // AWS/GCP metadata
    "172.16.0.1",
    "172.31.255.255",
    "192.168.0.1",
    "192.168.1.1",
    "100.64.0.1", // CGNAT
    "100.127.255.255",
    "192.0.0.1",
    "198.18.0.1", // benchmarking
    "224.0.0.1", // multicast
    "240.0.0.1", // reserved
    "255.255.255.255",
  ];
  for (const ip of blocked) {
    it(`blocks ${ip}`, () => expect(isBlockedIp(ip)).toBe(true));
  }

  const allowed = [
    "8.8.8.8",
    "1.1.1.1",
    "93.184.216.34", // example.com
    "172.15.0.1", // just below the private block
    "172.32.0.1", // just above the private block
    "192.169.0.1", // not 192.168
    "100.63.255.255", // just below CGNAT
    "100.128.0.1", // just above CGNAT
    "198.20.0.1", // just above benchmarking
  ];
  for (const ip of allowed) {
    it(`allows ${ip}`, () => expect(isBlockedIp(ip)).toBe(false));
  }
});

describe("isBlockedIp — IPv6", () => {
  const blocked = [
    "::1", // loopback
    "::", // unspecified
    "fc00::1", // ULA
    "fd12:3456::1", // ULA
    "fe80::1", // link-local
    "ff02::1", // multicast
    "::ffff:127.0.0.1", // v4-mapped loopback
    "::ffff:169.254.169.254", // v4-mapped metadata
    "::ffff:a9fe:a9fe", // v4-mapped metadata, hex form (169.254.169.254)
  ];
  for (const ip of blocked) {
    it(`blocks ${ip}`, () => expect(isBlockedIp(ip)).toBe(true));
  }

  const allowed = [
    "2606:4700:4700::1111", // Cloudflare DNS
    "2001:4860:4860::8888", // Google DNS
    "::ffff:8.8.8.8", // v4-mapped public
  ];
  for (const ip of allowed) {
    it(`allows ${ip}`, () => expect(isBlockedIp(ip)).toBe(false));
  }
});

describe("assertPublicUrl", () => {
  it("rejects non-http(s) schemes", async () => {
    await expect(assertPublicUrl("file:///etc/passwd")).rejects.toBeInstanceOf(
      SsrfBlockedError
    );
    await expect(assertPublicUrl("gopher://1.2.3.4/")).rejects.toBeInstanceOf(
      SsrfBlockedError
    );
  });

  it("rejects literal private/metadata IPs without a DNS lookup", async () => {
    await expect(assertPublicUrl("http://169.254.169.254/latest/meta-data/")).rejects.toBeInstanceOf(
      SsrfBlockedError
    );
    await expect(assertPublicUrl("http://127.0.0.1:8080/")).rejects.toBeInstanceOf(
      SsrfBlockedError
    );
    await expect(assertPublicUrl("http://[::1]/")).rejects.toBeInstanceOf(
      SsrfBlockedError
    );
    await expect(assertPublicUrl("http://10.0.0.5/")).rejects.toBeInstanceOf(
      SsrfBlockedError
    );
  });

  it("rejects a malformed URL", async () => {
    await expect(assertPublicUrl("not a url")).rejects.toBeInstanceOf(
      SsrfBlockedError
    );
  });

  it("allows a public literal IP", async () => {
    const u = await assertPublicUrl("https://8.8.8.8/");
    expect(u.hostname).toBe("8.8.8.8");
  });
});
