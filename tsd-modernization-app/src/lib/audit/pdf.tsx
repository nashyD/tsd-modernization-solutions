import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { AuditScores } from "@/lib/audit/types";
import { PACKAGES } from "@/lib/packages";

/**
 * Branded TSD audit PDF — 2 pages, Letter, server-rendered via @react-pdf/renderer.
 * Page 1: header, presence score, pillar grid, top gaps.
 * Page 2: recommended package + CTA.
 *
 * Uses @react-pdf's built-in Helvetica family (no Font.register, no font files
 * shipped in the bundle). Colors mirror src/app/globals.css.
 */

const COLORS = {
  navy: "#13294B",
  carolinaBlue: "#4B9CD3",
  carolinaBlueSoft: "#E8F2F9",
  navySoft: "#E5E9F1",
  text: "#0A1525",
  textMuted: "#4A5568",
  textSubtle: "#717D8C",
  border: "#E2E8F0",
  surface: "#FAFBFC",
  surface2: "#F4F6F8",
  danger: "#B91C1C",
  dangerSoft: "#FEE2E2",
  warning: "#B45309",
  warningSoft: "#FEF3C7",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.text,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 44,
    lineHeight: 1.4,
  },
  // Header brand
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 22,
  },
  brandSquares: {
    flexDirection: "row",
    gap: 1.5,
  },
  brandSquare: {
    width: 6,
    height: 6,
  },
  brandText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    letterSpacing: 0.4,
  },
  eyebrow: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.carolinaBlue,
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  businessName: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    letterSpacing: -0.4,
    lineHeight: 1.1,
    marginBottom: 8,
  },
  summary: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLORS.textSubtle,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  // Score
  scoreRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  scoreNum: {
    fontSize: 56,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    lineHeight: 1,
    letterSpacing: -1.5,
  },
  scoreOf: {
    fontSize: 14,
    color: COLORS.textSubtle,
    marginLeft: 6,
    paddingBottom: 6,
  },
  // Pillars
  pillarsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  pillarCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    padding: 8,
    backgroundColor: COLORS.surface,
  },
  pillarLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLORS.textSubtle,
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  pillarValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  // Gaps
  gap: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 10,
    marginBottom: 6,
    backgroundColor: COLORS.surface,
  },
  gapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  gapTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
    lineHeight: 1.3,
  },
  badge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    letterSpacing: 0.5,
  },
  badgeRed: { color: COLORS.danger, backgroundColor: COLORS.dangerSoft },
  badgeAmber: { color: COLORS.warning, backgroundColor: COLORS.warningSoft },
  badgeNeutral: { color: COLORS.textSubtle, backgroundColor: COLORS.surface2 },
  gapImpact: {
    fontSize: 9,
    color: COLORS.text,
    marginTop: 4,
    lineHeight: 1.4,
  },
  // Recommended package
  pkgEyebrowRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  pkgEyebrow: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLORS.carolinaBlue,
    backgroundColor: COLORS.carolinaBlueSoft,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    letterSpacing: 1,
  },
  pkgCap: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLORS.navy,
    backgroundColor: COLORS.navySoft,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    letterSpacing: 0.4,
  },
  pkgCard: {
    borderWidth: 1.5,
    borderColor: COLORS.carolinaBlue,
    borderRadius: 8,
    padding: 18,
    backgroundColor: COLORS.surface,
  },
  pkgName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  pkgPrice: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  pkgTagline: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginBottom: 14,
    lineHeight: 1.5,
  },
  pkgService: {
    flexDirection: "row",
    marginBottom: 5,
  },
  pkgBullet: {
    fontSize: 10,
    color: COLORS.carolinaBlue,
    marginRight: 6,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.4,
  },
  pkgServiceText: {
    fontSize: 9.5,
    color: COLORS.textMuted,
    flex: 1,
    lineHeight: 1.45,
  },
  pkgServiceName: {
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
  },
  guaranteeBox: {
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  guaranteeText: {
    fontSize: 9,
    color: COLORS.textMuted,
    lineHeight: 1.45,
  },
  ctaBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.navy,
    borderRadius: 6,
    padding: 14,
    marginTop: 14,
  },
  ctaPrimary: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
  },
  ctaSecondary: {
    color: COLORS.carolinaBlue,
    fontSize: 9,
    marginTop: 2,
  },
  ctaScarcity: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  ctaScarcityHint: {
    color: COLORS.carolinaBlue,
    fontSize: 8,
    marginTop: 2,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    fontSize: 7.5,
    color: COLORS.textSubtle,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    letterSpacing: 0.2,
  },
});

const PILLAR_LABELS: Record<keyof AuditScores["pillar_scores"], string> = {
  website: "Website",
  google: "Google",
  reviews: "Reviews",
  trust: "Trust",
  conversion: "Convert",
};

const SERVICE_LABELS: Record<
  AuditScores["tsd_services"][number]["service"],
  string
> = {
  website_rebuild: "Website rebuild",
  ai_chatbot: "AI chatbot",
  ai_receptionist: "AI receptionist",
  automation: "Workflow automation",
  seo_local: "Local SEO",
  review_management: "Review management",
  audit_only: "Discovery audit",
};

const SEVERITY_TONE: Record<
  AuditScores["gaps"][number]["severity"],
  "red" | "amber" | "neutral"
> = {
  critical: "red",
  high: "amber",
  medium: "neutral",
  low: "neutral",
};

function severityRank(s: AuditScores["gaps"][number]["severity"]) {
  switch (s) {
    case "critical":
      return 0;
    case "high":
      return 1;
    case "medium":
      return 2;
    case "low":
      return 3;
  }
}

function BrandLockup() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandSquares}>
        <View
          style={[
            styles.brandSquare,
            { backgroundColor: COLORS.carolinaBlue },
          ]}
        />
        <View style={[styles.brandSquare, { backgroundColor: COLORS.navy }]} />
        <View
          style={[
            styles.brandSquare,
            { backgroundColor: COLORS.carolinaBlue },
          ]}
        />
        <View style={[styles.brandSquare, { backgroundColor: COLORS.navy }]} />
      </View>
      <Text style={styles.brandText}>TSD MODERNIZATION SOLUTIONS</Text>
    </View>
  );
}

function Footer({ dateStr }: { dateStr: string }) {
  return (
    <Text
      style={styles.footer}
      render={({ pageNumber, totalPages }) =>
        `Prepared by TSD Modernization Solutions  ·  ${dateStr}  ·  tsd-modernization.com  ·  Page ${pageNumber} of ${totalPages}`
      }
      fixed
    />
  );
}

export interface AuditPdfProps {
  businessName: string;
  scores: AuditScores;
  generatedAt: Date;
}

export function AuditPdf({ businessName, scores, generatedAt }: AuditPdfProps) {
  const pkg = PACKAGES[scores.recommended_package];
  // Top 4 gaps fits comfortably on page 1 alongside the score block.
  const topGaps = [...scores.gaps]
    .sort((a, b) => severityRank(a.severity) - severityRank(b.severity))
    .slice(0, 4);
  const dateStr = generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`${businessName} — TSD Modernization Audit`}
      author="TSD Modernization Solutions"
      creator="TSD Modernization Solutions"
      producer="TSD Modernization Solutions"
    >
      {/* Page 1 — score + gaps */}
      <Page size="LETTER" style={styles.page}>
        <BrandLockup />
        <Text style={styles.eyebrow}>MODERNIZATION AUDIT</Text>
        <Text style={styles.businessName}>{businessName}</Text>
        <Text style={styles.summary}>{scores.one_line_summary}</Text>

        <Text style={styles.sectionLabel}>PRESENCE SCORE</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreNum}>{scores.presence_score}</Text>
          <Text style={styles.scoreOf}>/ 100</Text>
        </View>

        <View style={styles.pillarsRow}>
          {(
            Object.entries(scores.pillar_scores) as [
              keyof AuditScores["pillar_scores"],
              number,
            ][]
          ).map(([k, v]) => (
            <View key={k} style={styles.pillarCard}>
              <Text style={styles.pillarLabel}>
                {PILLAR_LABELS[k].toUpperCase()}
              </Text>
              <Text style={styles.pillarValue}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>What we found</Text>
        {topGaps.map((g, i) => {
          const tone = SEVERITY_TONE[g.severity];
          const badgeStyle =
            tone === "red"
              ? styles.badgeRed
              : tone === "amber"
                ? styles.badgeAmber
                : styles.badgeNeutral;
          return (
            <View key={i} style={styles.gap} wrap={false}>
              <View style={styles.gapHeader}>
                <Text style={styles.gapTitle}>{g.title}</Text>
                <Text style={[styles.badge, badgeStyle]}>
                  {g.severity.toUpperCase()}
                </Text>
              </View>
              {g.impact ? (
                <Text style={styles.gapImpact}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Impact: </Text>
                  {g.impact}
                </Text>
              ) : null}
            </View>
          );
        })}

        <Footer dateStr={dateStr} />
      </Page>

      {/* Page 2 — recommended package + CTA */}
      <Page size="LETTER" style={styles.page}>
        <BrandLockup />
        <Text style={styles.eyebrow}>RECOMMENDED NEXT STEP</Text>

        <View style={styles.pkgCard}>
          <View style={styles.pkgEyebrowRow}>
            <Text style={styles.pkgEyebrow}>RECOMMENDED PACKAGE</Text>
            {pkg.cap ? <Text style={styles.pkgCap}>{pkg.cap}</Text> : null}
          </View>
          <Text style={styles.pkgName}>{pkg.name}</Text>
          <Text style={styles.pkgPrice}>{pkg.price}</Text>
          <Text style={styles.pkgTagline}>{pkg.tagline}</Text>

          <Text style={styles.sectionLabel}>WHAT WE&apos;D SHIP</Text>
          {scores.tsd_services.map((s, i) => (
            <View key={i} style={styles.pkgService} wrap={false}>
              <Text style={styles.pkgBullet}>•</Text>
              <Text style={styles.pkgServiceText}>
                <Text style={styles.pkgServiceName}>
                  {SERVICE_LABELS[s.service]}.
                </Text>{" "}
                {s.rationale}
              </Text>
            </View>
          ))}

          {pkg.guarantee ? (
            <View style={styles.guaranteeBox} wrap={false}>
              <Text style={styles.sectionLabel}>GUARANTEE</Text>
              <Text style={styles.guaranteeText}>{pkg.guarantee}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.ctaBox} wrap={false}>
          <View>
            <Text style={styles.ctaPrimary}>Book a free fit call</Text>
            <Text style={styles.ctaSecondary}>
              tsd-modernization.com/book
            </Text>
          </View>
          <View>
            <Text style={styles.ctaScarcity}>Cohort closes Aug 10, 2026</Text>
            <Text style={styles.ctaScarcityHint}>
              Last project start July 13
            </Text>
          </View>
        </View>

        <Footer dateStr={dateStr} />
      </Page>
    </Document>
  );
}
