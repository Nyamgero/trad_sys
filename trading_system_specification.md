# Trading & Portfolio System Specification

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRADING SYSTEM                                     │
│                    (Operational / Real-Time Focus)                          │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│   POSITIONS     │      P&L        │    LIQUIDITY    │    ORDER MGMT         │
│  (Live View)    │  (Real-Time)    │   (Monitoring)  │    (Execution)        │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PORTFOLIO MANAGEMENT                                  │
│                      (Managerial / Strategic)                               │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│   ALLOCATION    │   PERFORMANCE   │      RISK       │    COMPLIANCE         │
│   & WEIGHTS     │   ATTRIBUTION   │    ANALYTICS    │    & LIMITS           │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

---

# PART 1: TRADING SYSTEM (Operational)

The trading system focuses on real-time monitoring and execution. Data refreshes range from tick-level to daily depending on the view.

---

## 1.1 POSITIONS VIEW

### Purpose
Track current holdings across all asset classes with real-time valuation and intraday movement.

---

### 1.1.1 EQUITY POSITIONS (by Ticker)

| Ticker | Name | Exchange | CCY | Quantity | Avg Cost | Last Price | Bid | Ask | Spread % | Market Value | Market Value (Base) | Day Chg | Day Chg % | Updated |
|--------|------|----------|-----|----------|----------|------------|-----|-----|----------|--------------|---------------------|---------|-----------|---------|
| AAPL | Apple Inc | NASDAQ | USD | 10,000 | 178.50 | 185.25 | 185.20 | 185.30 | 0.05% | 1,852,500 | 1,852,500 | +2.15 | +1.17% | 14:32:15 |
| SAB.JO | SABMiller | JSE | ZAR | 50,000 | 890.00 | 912.50 | 912.00 | 913.00 | 0.11% | 45,625,000 | 2,437,433 | +12.50 | +1.39% | 14:32:10 |
| SHEL.L | Shell PLC | LSE | GBP | 25,000 | 24.80 | 25.45 | 25.44 | 25.46 | 0.08% | 636,250 | 807,531 | -0.32 | -1.24% | 14:31:58 |
| SFEN.PA | Safran SA | EPA | EUR | 8,000 | 152.30 | 158.90 | 158.85 | 158.95 | 0.06% | 1,271,200 | 1,385,608 | +3.20 | +2.05% | 14:32:05 |

**Grid Critical Fields (Always Visible):**
- Ticker, Name, Quantity, Last Price, Market Value (Base), Day Chg %

**Expandable Detail Fields:**
- Avg Cost, Bid/Ask, Spread %, Exchange, Last Updated

---

### 1.1.2 ETF POSITIONS (by Ticker)

| Ticker | Name | Exchange | CCY | Units | Avg Cost | Last Price | NAV | Prem/Disc % | Bid | Ask | Spread % | Market Value | Market Value (Base) | Day Chg % | Updated |
|--------|------|----------|-----|-------|----------|------------|-----|-------------|-----|-----|----------|--------------|---------------------|-----------|---------|
| SPY | SPDR S&P 500 | NYSE | USD | 5,000 | 448.20 | 455.80 | 455.65 | +0.03% | 455.75 | 455.85 | 0.02% | 2,279,000 | 2,279,000 | +0.85% | 14:32:12 |
| STXEMG | Satrix Emerging Markets | JSE | ZAR | 100,000 | 52.30 | 54.15 | 54.08 | +0.13% | 54.10 | 54.20 | 0.18% | 5,415,000 | 289,304 | +1.22% | 14:31:45 |
| EWJ | iShares Japan | NYSE | USD | 15,000 | 68.90 | 71.25 | 71.30 | -0.07% | 71.22 | 71.28 | 0.08% | 1,068,750 | 1,068,750 | -0.42% | 14:32:08 |
| VXUS | Vanguard Intl Stocks | NYSE | USD | 8,000 | 58.40 | 60.15 | 60.12 | +0.05% | 60.12 | 60.18 | 0.10% | 481,200 | 481,200 | +0.65% | 14:32:14 |

**Grid Critical Fields (Always Visible):**
- Ticker, Name, Units, Last Price, NAV, Prem/Disc %, Market Value (Base), Day Chg %

**Expandable Detail Fields:**
- Avg Cost, Bid/Ask, Spread %, Expense Ratio, Tracking Error, AUM

**ETF-Specific Alerts:**
- ⚠️ Premium/Discount > 0.5%
- ⚠️ Spread > 0.25%
- ⚠️ Low AUM (< $100M)

---

### 1.1.3 FX POSITIONS (by Currency Pair)

| CCY Pair | Direction | Notional (Base CCY) | Notional (Term CCY) | Avg Rate | Spot Rate | Bid | Ask | Spread (pips) | MTM Value (Base) | Day Chg (pips) | Day Chg % | Updated |
|----------|-----------|---------------------|---------------------|----------|-----------|-----|-----|---------------|------------------|----------------|-----------|---------|
| USD/ZAR | Long USD | 5,000,000 | 93,750,000 | 18.7500 | 18.7125 | 18.7100 | 18.7150 | 5.0 | -18,750 | -37.5 | -0.20% | 14:32:18 |
| EUR/USD | Long EUR | 2,000,000 | 2,180,000 | 1.0900 | 1.0925 | 1.0923 | 1.0927 | 0.4 | +5,000 | +2.5 | +0.23% | 14:32:19 |
| GBP/USD | Short GBP | -1,500,000 | -1,905,000 | 1.2700 | 1.2685 | 1.2683 | 1.2687 | 0.4 | +2,250 | +1.5 | +0.12% | 14:32:17 |
| USD/KES | Long USD | 3,000,000 | 387,000,000 | 129.0000 | 128.5000 | 128.4000 | 128.6000 | 20.0 | -15,000 | -50.0 | -0.39% | 14:31:50 |

**Grid Critical Fields (Always Visible):**
- CCY Pair, Direction, Notional (Base), Spot Rate, MTM Value, Day Chg %

**Expandable Detail Fields:**
- Avg Rate, Bid/Ask, Spread, Term Notional, Forward Points

**FX Position Summary Row:**
| Base Currency | Net Exposure | MTM P&L | Hedged % |
|---------------|--------------|---------|----------|
| USD | 8,000,000 | -26,500 | 62% |
| EUR | 2,000,000 | +5,000 | 0% |
| GBP | -1,500,000 | +2,250 | 100% |

---

### 1.1.4 BOND POSITIONS (by ISIN)

| ISIN | Name | Issuer | CCY | Face Value | Quantity | Avg Price | Clean Price | Dirty Price | Accrued Int | YTM | Duration | Market Value | Market Value (Base) | Day Chg (bps) | Updated |
|------|------|--------|-----|------------|----------|-----------|-------------|-------------|-------------|-----|----------|--------------|---------------------|---------------|---------|
| US912828ZT25 | UST 2.5% 2030 | US Treasury | USD | 100 | 5,000,000 | 98.25 | 99.15 | 99.45 | 0.30 | 2.68% | 5.8 | 4,972,500 | 4,972,500 | -3.5 | 14:32:00 |
| ZAG000106284 | R2030 8.0% | SA Govt | ZAR | 100 | 50,000,000 | 102.50 | 103.25 | 104.15 | 0.90 | 10.25% | 4.2 | 52,075,000 | 2,782,620 | +5.2 | 14:31:30 |
| XS2010028186 | Sasol 5.5% 2031 | Sasol Ltd | USD | 1,000 | 2,000 | 95.80 | 94.50 | 95.20 | 0.70 | 6.45% | 5.1 | 1,904,000 | 1,904,000 | +8.0 | 14:30:45 |
| KE0000000551 | FXD1/2024/10 | Kenya Govt | KES | 100 | 100,000,000 | 99.50 | 98.75 | 99.85 | 1.10 | 16.50% | 6.3 | 99,850,000 | 776,357 | +12.0 | 14:28:00 |

**Grid Critical Fields (Always Visible):**
- ISIN, Name, Face Value, Clean Price, YTM, Duration, Market Value (Base), Day Chg (bps)

**Expandable Detail Fields:**
- Dirty Price, Accrued Interest, Coupon, Maturity Date, Rating, Spread to Benchmark

**Bond-Specific Calculated Fields:**
- DV01 (Dollar Value of 01): Price sensitivity to 1bp yield change
- Convexity: Second-order price sensitivity
- Z-Spread: Spread over risk-free curve

---

## 1.2 P&L VIEW

### Purpose
Track profit and loss in real-time across all positions, with drill-down by asset class.

---

### 1.2.1 EQUITY P&L (by Ticker)

| Ticker | Name | Quantity | Avg Cost | Last Price | Cost Basis | Market Value | Unrealized P&L | Unrealized % | Realized P&L (YTD) | Total P&L | Day P&L | Day P&L % |
|--------|------|----------|----------|------------|------------|--------------|----------------|--------------|--------------------| ----------|---------|-----------|
| AAPL | Apple Inc | 10,000 | 178.50 | 185.25 | 1,785,000 | 1,852,500 | +67,500 | +3.78% | +25,000 | +92,500 | +21,500 | +1.17% |
| SAB.JO | SABMiller | 50,000 | 890.00 | 912.50 | 44,500,000 | 45,625,000 | +1,125,000 | +2.53% | +500,000 | +1,625,000 | +625,000 | +1.39% |
| SHEL.L | Shell PLC | 25,000 | 24.80 | 25.45 | 620,000 | 636,250 | +16,250 | +2.62% | -8,500 | +7,750 | -8,000 | -1.24% |
| SFEN.PA | Safran SA | 8,000 | 152.30 | 158.90 | 1,218,400 | 1,271,200 | +52,800 | +4.33% | +0 | +52,800 | +25,600 | +2.05% |
| **TOTAL** | | | | | **48,123,400** | **49,385,950** | **+1,261,550** | **+2.62%** | **+516,500** | **+1,778,050** | **+664,100** | **+1.36%** |

**P&L Summary Card:**
```
┌──────────────────────────────────────────────────────────────┐
│  EQUITY P&L SUMMARY                                          │
├──────────────────┬──────────────────┬────────────────────────┤
│  Day P&L         │  MTD P&L         │  YTD P&L              │
│  +$664,100       │  +$1,245,800     │  +$3,456,200          │
│  +1.36%          │  +2.58%          │  +7.53%               │
└──────────────────┴──────────────────┴────────────────────────┘
```

---

### 1.2.2 ETF P&L (by Ticker)

| Ticker | Name | Units | Avg Cost | Last Price | Cost Basis | Market Value | Unrealized P&L | Unrealized % | Realized P&L (YTD) | Total P&L | Day P&L | Day P&L % |
|--------|------|-------|----------|------------|------------|--------------|----------------|--------------|--------------------| ----------|---------|-----------|
| SPY | SPDR S&P 500 | 5,000 | 448.20 | 455.80 | 2,241,000 | 2,279,000 | +38,000 | +1.70% | +15,000 | +53,000 | +19,250 | +0.85% |
| STXEMG | Satrix EM | 100,000 | 52.30 | 54.15 | 5,230,000 | 5,415,000 | +185,000 | +3.54% | +0 | +185,000 | +65,150 | +1.22% |
| EWJ | iShares Japan | 15,000 | 68.90 | 71.25 | 1,033,500 | 1,068,750 | +35,250 | +3.41% | +8,200 | +43,450 | -4,500 | -0.42% |
| VXUS | Vanguard Intl | 8,000 | 58.40 | 60.15 | 467,200 | 481,200 | +14,000 | +3.00% | +0 | +14,000 | +3,120 | +0.65% |
| **TOTAL** | | | | | **8,971,700** | **9,243,950** | **+272,250** | **+3.03%** | **+23,200** | **+295,450** | **+83,020** | **+0.91%** |

---

### 1.2.3 FX P&L (by Currency Pair)

| CCY Pair | Direction | Notional | Avg Rate | Spot Rate | Rate P&L (pips) | Realized P&L | Unrealized P&L | Total P&L | Day P&L | Day P&L % | Fwd Points P&L |
|----------|-----------|----------|----------|-----------|-----------------|--------------|----------------|-----------|---------|-----------|----------------|
| USD/ZAR | Long USD | 5,000,000 | 18.7500 | 18.7125 | -37.5 | +125,000 | -18,750 | +106,250 | -18,750 | -0.20% | +2,500 |
| EUR/USD | Long EUR | 2,000,000 | 1.0900 | 1.0925 | +25.0 | +0 | +5,000 | +5,000 | +5,000 | +0.23% | -1,200 |
| GBP/USD | Short GBP | 1,500,000 | 1.2700 | 1.2685 | +15.0 | +12,500 | +2,250 | +14,750 | +2,250 | +0.12% | +800 |
| USD/KES | Long USD | 3,000,000 | 129.0000 | 128.5000 | -50.0 | +0 | -15,000 | -15,000 | -15,000 | -0.39% | +5,200 |
| **TOTAL** | | | | | | **+137,500** | **-26,500** | **+111,000** | **-26,500** | **-0.24%** | **+7,300** |

**FX P&L Attribution:**
| Component | Amount | % of Total |
|-----------|--------|------------|
| Spot P&L | +103,700 | 93.4% |
| Forward Points | +7,300 | 6.6% |
| **Total FX P&L** | **+111,000** | **100%** |

---

### 1.2.4 BOND P&L (by ISIN)

| ISIN | Name | Face Value | Avg Price | Clean Price | Price P&L | Coupon Received | Accrued P&L | Roll P&L | Unrealized P&L | Realized P&L | Total P&L | Day P&L (bps) |
|------|------|------------|-----------|-------------|-----------|-----------------|-------------|----------|----------------|--------------|-----------|---------------|
| US912828ZT25 | UST 2.5% 2030 | 5,000,000 | 98.25 | 99.15 | +45,000 | +62,500 | +15,000 | +2,500 | +45,000 | +80,000 | +125,000 | -3.5 |
| ZAG000106284 | R2030 8.0% | 50,000,000 | 102.50 | 103.25 | +375,000 | +2,000,000 | +450,000 | +25,000 | +375,000 | +2,475,000 | +2,850,000 | +5.2 |
| XS2010028186 | Sasol 5.5% 2031 | 2,000,000 | 95.80 | 94.50 | -26,000 | +55,000 | +14,000 | -5,000 | -26,000 | +64,000 | +38,000 | +8.0 |
| KE0000000551 | FXD1/2024/10 | 100,000,000 | 99.50 | 98.75 | -750,000 | +8,000,000 | +1,100,000 | +0 | -750,000 | +9,100,000 | +8,350,000 | +12.0 |
| **TOTAL** | | | | | **-356,000** | **+10,117,500** | **+1,579,000** | **+22,500** | **-356,000** | **+11,719,000** | **+11,363,000** | |

**Bond P&L Attribution:**
| Component | Amount | % of Total |
|-----------|--------|------------|
| Price P&L (Capital) | -356,000 | -3.1% |
| Coupon Income | +10,117,500 | 89.0% |
| Accrued Interest | +1,579,000 | 13.9% |
| Roll/Carry | +22,500 | 0.2% |
| **Total Bond P&L** | **+11,363,000** | **100%** |

---

## 1.3 LIQUIDITY VIEW

### Purpose
Monitor market liquidity and execution risk across all positions.

---

### 1.3.1 EQUITY LIQUIDITY

| Ticker | Name | Quantity | Market Value | ADV (20D) | ADV Value | Position % ADV | Days to Liquidate | Bid-Ask Spread | Spread Cost | Liquidity Score |
|--------|------|----------|--------------|-----------|-----------|----------------|-------------------|----------------|-------------|-----------------|
| AAPL | Apple Inc | 10,000 | 1,852,500 | 45,000,000 | 8.3B | 0.02% | 0.01 | 0.05% | $926 | ●●●●● (5/5) |
| SAB.JO | SABMiller | 50,000 | 2,437,433 | 850,000 | 775M | 5.9% | 0.06 | 0.11% | $2,681 | ●●●●○ (4/5) |
| SHEL.L | Shell PLC | 25,000 | 807,531 | 12,000,000 | 305M | 0.21% | 0.01 | 0.08% | $646 | ●●●●● (5/5) |
| SFEN.PA | Safran SA | 8,000 | 1,385,608 | 450,000 | 71M | 1.8% | 0.02 | 0.06% | $831 | ●●●●○ (4/5) |

**Liquidity Alerts:**
- 🔴 Position > 25% ADV → Liquidation Risk
- 🟡 Position > 10% ADV → Monitor Closely
- 🟢 Position < 10% ADV → Normal

---

### 1.3.2 ETF LIQUIDITY

| Ticker | Name | Units | Market Value | ADV (20D) | ADV Value | Position % ADV | Days to Liquidate | Bid-Ask Spread | Premium/Disc | AUM | Liquidity Score |
|--------|------|-------|--------------|-----------|-----------|----------------|-------------------|----------------|--------------|-----|-----------------|
| SPY | SPDR S&P 500 | 5,000 | 2,279,000 | 80,000,000 | 36.5B | 0.01% | 0.01 | 0.02% | +0.03% | 450B | ●●●●● (5/5) |
| STXEMG | Satrix EM | 100,000 | 289,304 | 250,000 | 13.5M | 40.0% | 0.40 | 0.18% | +0.13% | 850M | ●●●○○ (3/5) |
| EWJ | iShares Japan | 15,000 | 1,068,750 | 5,000,000 | 356M | 0.30% | 0.01 | 0.08% | -0.07% | 12B | ●●●●● (5/5) |
| VXUS | Vanguard Intl | 8,000 | 481,200 | 4,500,000 | 271M | 0.18% | 0.01 | 0.10% | +0.05% | 65B | ●●●●● (5/5) |

---

### 1.3.3 FX LIQUIDITY

| CCY Pair | Notional | Daily Volume (Est) | Position % Volume | Bid-Ask Spread | Spread Cost | Time to Execute | Market Hours | Liquidity Score |
|----------|----------|--------------------| ------------------|----------------|-------------|-----------------|--------------|-----------------|
| USD/ZAR | 5,000,000 | 25B | 0.02% | 5.0 pips | $1,335 | < 1 min | Active | ●●●●○ (4/5) |
| EUR/USD | 2,000,000 | 500B | 0.0004% | 0.4 pips | $73 | < 1 sec | Active | ●●●●● (5/5) |
| GBP/USD | 1,500,000 | 300B | 0.0005% | 0.4 pips | $47 | < 1 sec | Active | ●●●●● (5/5) |
| USD/KES | 3,000,000 | 500M | 0.60% | 20.0 pips | $4,669 | 5-10 min | Limited | ●●○○○ (2/5) |

**FX Liquidity Notes:**
- G10 pairs: Near-instant execution, minimal market impact
- EM pairs: May require working orders, wider spreads during off-hours
- Exotic pairs (KES, UGX, NGN): Limited liquidity windows, consider order timing

---

### 1.3.4 BOND LIQUIDITY

| ISIN | Name | Face Value | Market Value | Est Daily Volume | Position % Volume | Bid-Ask Spread | Spread Cost | Dealer Count | Last Trade | Liquidity Score |
|------|------|------------|--------------|------------------|-------------------|----------------|-------------|--------------|------------|-----------------|
| US912828ZT25 | UST 2.5% 2030 | 5,000,000 | 4,972,500 | 2B | 0.25% | 0.5 bps | $2,486 | 20+ | Today | ●●●●● (5/5) |
| ZAG000106284 | R2030 8.0% | 50,000,000 | 2,782,620 | 500M | 10.0% | 5.0 bps | $13,913 | 8 | Today | ●●●●○ (4/5) |
| XS2010028186 | Sasol 5.5% 2031 | 2,000,000 | 1,904,000 | 10M | 20.0% | 25 bps | $47,600 | 3 | 2 days ago | ●●○○○ (2/5) |
| KE0000000551 | FXD1/2024/10 | 100,000,000 | 776,357 | 50M | 200% | 50 bps | $38,818 | 2 | 1 week ago | ●○○○○ (1/5) |

**Bond Liquidity Alerts:**
- 🔴 Last trade > 5 days → Stale pricing risk
- 🔴 Position > 50% daily volume → Large position risk
- 🟡 Spread > 20 bps → High transaction cost

---

## 1.4 DAILY SUMMARY VIEW

### Purpose
End-of-day reconciliation and daily P&L attribution.

| Asset Class | Positions | Market Value (Base) | Day P&L | Day P&L % | MTD P&L | YTD P&L |
|-------------|-----------|---------------------|---------|-----------|---------|---------|
| Equities | 4 | 6,083,722 | +664,100 | +1.36% | +1,245,800 | +3,456,200 |
| ETFs | 4 | 4,118,254 | +83,020 | +0.91% | +156,400 | +512,800 |
| FX | 4 | 0 (delta) | -26,500 | -0.24% | +85,200 | +245,600 |
| Bonds | 4 | 10,435,477 | +125,850 | +0.15% | +890,500 | +3,245,000 |
| **TOTAL** | **16** | **20,637,453** | **+846,470** | **+0.89%** | **+2,377,900** | **+7,459,600** |

---

# PART 2: PORTFOLIO MANAGEMENT (Managerial)

Portfolio Management focuses on strategic allocation, risk analytics, and compliance monitoring.

---

## 2.1 PORTFOLIO OVERVIEW

### AUM Summary

| Metric | Value |
|--------|-------|
| Total AUM | $125,450,000 |
| Cash & Equivalents | $8,250,000 (6.6%) |
| Invested Capital | $117,200,000 (93.4%) |
| Accrued Fees | -$125,000 |
| NAV | $125,325,000 |

### Asset Allocation

| Asset Class | Market Value | Weight | Target | Deviation | Status |
|-------------|--------------|--------|--------|-----------|--------|
| Equities | $45,250,000 | 36.1% | 35.0% | +1.1% | ⚠️ Overweight |
| ETFs | $28,500,000 | 22.7% | 25.0% | -2.3% | ⚠️ Underweight |
| Bonds | $35,200,000 | 28.1% | 30.0% | -1.9% | ⚠️ Underweight |
| FX (Net) | $0 | 0.0% | 0.0% | 0.0% | ✅ On Target |
| Cash | $8,250,000 | 6.6% | 5.0% | +1.6% | ⚠️ High Cash |
| Alternatives | $8,250,000 | 6.5% | 5.0% | +1.5% | ⚠️ Overweight |
| **TOTAL** | **$125,450,000** | **100%** | **100%** | | |

---

## 2.2 REGIONAL & SECTOR EXPOSURE

### Geographic Allocation

| Region | Market Value | Weight | Benchmark | Active Weight |
|--------|--------------|--------|-----------|---------------|
| North America | $52,500,000 | 41.9% | 45.0% | -3.1% |
| Europe | $28,750,000 | 22.9% | 20.0% | +2.9% |
| Africa (ex-SA) | $18,500,000 | 14.7% | 10.0% | +4.7% |
| South Africa | $15,200,000 | 12.1% | 15.0% | -2.9% |
| Asia Pacific | $10,500,000 | 8.4% | 10.0% | -1.6% |

### Sector Allocation (Equities + ETFs)

| Sector | Market Value | Weight | Benchmark | Active Weight |
|--------|--------------|--------|-----------|---------------|
| Technology | $18,500,000 | 25.1% | 28.0% | -2.9% |
| Financials | $14,200,000 | 19.2% | 15.0% | +4.2% |
| Energy | $11,800,000 | 16.0% | 12.0% | +4.0% |
| Healthcare | $9,500,000 | 12.9% | 14.0% | -1.1% |
| Consumer | $8,200,000 | 11.1% | 12.0% | -0.9% |
| Industrials | $7,500,000 | 10.2% | 10.0% | +0.2% |
| Other | $4,050,000 | 5.5% | 9.0% | -3.5% |

---

## 2.3 RISK ANALYTICS

### Portfolio Risk Metrics

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| Portfolio Beta | 1.05 | 1.00 | Slightly Aggressive |
| Volatility (Ann.) | 14.2% | 12.5% | Above Benchmark |
| Sharpe Ratio | 1.25 | 1.10 | Outperforming |
| Sortino Ratio | 1.85 | 1.45 | Strong Downside Protection |
| Max Drawdown (YTD) | -8.5% | -10.2% | Better than Benchmark |
| VaR (95%, 1-day) | $1,875,000 | — | 1.5% of AUM |
| CVaR (95%, 1-day) | $2,450,000 | — | 1.95% of AUM |

### Duration & Interest Rate Risk (Bonds Only)

| Metric | Value |
|--------|-------|
| Portfolio Duration | 5.2 years |
| Modified Duration | 4.9 |
| DV01 (Total) | $172,500 |
| Convexity | 28.5 |
| Key Rate DV01 (2Y) | $25,000 |
| Key Rate DV01 (5Y) | $85,000 |
| Key Rate DV01 (10Y) | $62,500 |

### Currency Exposure

| Currency | Gross Exposure | Net Exposure | Hedge Ratio | Unhedged Risk |
|----------|----------------|--------------|-------------|---------------|
| USD | $85,000,000 | $55,000,000 | 35% | $55M |
| ZAR | $48,000,000 | $48,000,000 | 0% | $48M |
| EUR | $12,500,000 | $8,500,000 | 32% | $8.5M |
| GBP | $8,500,000 | $0 | 100% | $0 |
| KES | $5,200,000 | $5,200,000 | 0% | $5.2M |

---

## 2.4 PERFORMANCE ATTRIBUTION

### Return Attribution (YTD)

| Component | Return | Contribution |
|-----------|--------|--------------|
| **Total Return** | **+8.25%** | **+8.25%** |
| Asset Allocation | +1.85% | +1.85% |
| Security Selection | +3.20% | +3.20% |
| Currency Effect | +0.45% | +0.45% |
| Interaction Effect | +0.25% | +0.25% |
| Residual | +2.50% | +2.50% |

### Attribution by Asset Class

| Asset Class | Weight | Return | Contribution | vs Benchmark |
|-------------|--------|--------|--------------|--------------|
| Equities | 36.1% | +12.5% | +4.51% | +1.25% |
| ETFs | 22.7% | +8.2% | +1.86% | -0.35% |
| Bonds | 28.1% | +4.5% | +1.26% | +0.15% |
| FX | 0.0% | — | +0.45% | +0.45% |
| Cash | 6.6% | +2.5% | +0.17% | -0.05% |
| Alternatives | 6.5% | +0.0% | +0.00% | -0.85% |

---

## 2.5 COMPLIANCE & LIMITS

### Regulatory Limits

| Limit | Current | Maximum | Utilization | Status |
|-------|---------|---------|-------------|--------|
| Single Security | 4.8% | 5.0% | 96% | ⚠️ Near Limit |
| Single Issuer | 8.2% | 10.0% | 82% | ✅ OK |
| Single Sector | 25.1% | 30.0% | 84% | ✅ OK |
| Single Country | 41.9% | 50.0% | 84% | ✅ OK |
| Illiquid Assets | 3.5% | 10.0% | 35% | ✅ OK |
| Leverage | 0% | 0% | 0% | ✅ OK |
| Cash Minimum | 6.6% | 2.0% | — | ✅ Above Min |

### Investment Policy Compliance

| Policy | Rule | Current | Status |
|--------|------|---------|--------|
| Min Credit Rating | BBB- | BB+ (1 position) | ⚠️ Breach |
| Max Duration | 8.0 years | 5.2 years | ✅ OK |
| Min Positions | 20 | 16 | ⚠️ Below Min |
| Max Cash | 10% | 6.6% | ✅ OK |
| Dividend Yield Min | 1.5% | 2.1% | ✅ OK |

---

## 2.6 TOP HOLDINGS

### Top 10 Positions by Market Value

| Rank | Asset | Type | Market Value | Weight | P&L (YTD) | P&L % |
|------|-------|------|--------------|--------|-----------|-------|
| 1 | R2030 8.0% | Bond | $2,782,620 | 2.22% | +285,000 | +11.4% |
| 2 | SABMiller | Equity | $2,437,433 | 1.94% | +162,500 | +7.1% |
| 3 | SPY | ETF | $2,279,000 | 1.82% | +53,000 | +2.4% |
| 4 | Sasol 5.5% 2031 | Bond | $1,904,000 | 1.52% | +38,000 | +2.0% |
| 5 | Apple Inc | Equity | $1,852,500 | 1.48% | +92,500 | +5.3% |
| 6 | Safran SA | Equity | $1,385,608 | 1.10% | +52,800 | +4.0% |
| 7 | iShares Japan | ETF | $1,068,750 | 0.85% | +43,450 | +4.2% |
| 8 | Shell PLC | Equity | $807,531 | 0.64% | +7,750 | +1.0% |
| 9 | FXD1/2024/10 | Bond | $776,357 | 0.62% | +835,000 | +107.6% |
| 10 | Vanguard Intl | ETF | $481,200 | 0.38% | +14,000 | +3.0% |

---

# PART 3: UI/UX RECOMMENDATIONS

## Grid Layout Principles

### Critical Information Hierarchy

**Level 1 (Always Visible):**
- Identifier (Ticker/ISIN/CCY Pair)
- Name
- Position Size
- Current Price/Rate
- Market Value (Base Currency)
- Day Change %
- P&L indicator (green/red)

**Level 2 (Expandable Row):**
- Full pricing details (Bid/Ask/Spread)
- Cost basis and historical P&L
- Risk metrics (Duration/Beta/VaR)
- Liquidity metrics

**Level 3 (Drill-Down Modal):**
- Full transaction history
- Historical price chart
- Order book depth
- Related positions

### Color Coding

```
P&L Positive:  #10B981 (Green)
P&L Negative:  #EF4444 (Red)
P&L Neutral:   #6B7280 (Gray)

Alert High:    #DC2626 (Red)
Alert Medium:  #F59E0B (Amber)
Alert Low:     #3B82F6 (Blue)
Status OK:     #10B981 (Green)
```

### Refresh Rates

| Data Type | Trading Hours | After Hours |
|-----------|---------------|-------------|
| Prices (Equity/ETF) | 1 second | 15 minutes |
| FX Rates | 500ms | 5 minutes |
| Bond Prices | 30 seconds | Daily |
| P&L Calculations | 5 seconds | On demand |
| Risk Metrics | 1 minute | Daily |
| Portfolio Metrics | 5 minutes | Daily |

---

# PART 4: DATABASE SCHEMA SUGGESTIONS

## Core Tables

```sql
-- Positions table (unified)
positions (
    id UUID PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id),
    asset_class ENUM('equity', 'etf', 'fx', 'bond'),
    identifier VARCHAR(50),  -- Ticker, ISIN, or CCY pair
    quantity DECIMAL(20,8),
    avg_cost DECIMAL(20,8),
    cost_currency CHAR(3),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Real-time pricing (separate table for performance)
prices_realtime (
    identifier VARCHAR(50) PRIMARY KEY,
    asset_class ENUM('equity', 'etf', 'fx', 'bond'),
    bid DECIMAL(20,8),
    ask DECIMAL(20,8),
    last DECIMAL(20,8),
    volume BIGINT,
    updated_at TIMESTAMP
)

-- P&L snapshots
pnl_daily (
    id UUID PRIMARY KEY,
    position_id UUID REFERENCES positions(id),
    date DATE,
    market_value DECIMAL(20,2),
    unrealized_pnl DECIMAL(20,2),
    realized_pnl DECIMAL(20,2),
    day_pnl DECIMAL(20,2)
)

-- ETF-specific data
etf_data (
    ticker VARCHAR(20) PRIMARY KEY,
    nav DECIMAL(20,8),
    aum DECIMAL(20,2),
    expense_ratio DECIMAL(8,4),
    tracking_error DECIMAL(8,4),
    updated_at TIMESTAMP
)

-- Bond-specific data
bond_data (
    isin CHAR(12) PRIMARY KEY,
    coupon DECIMAL(8,4),
    maturity_date DATE,
    duration DECIMAL(8,4),
    ytm DECIMAL(8,4),
    rating VARCHAR(10),
    accrued_interest DECIMAL(20,8),
    updated_at TIMESTAMP
)
```

---

This specification provides a comprehensive framework for building your trading and portfolio management system. The separation between operational (Trading System) and strategic (Portfolio Management) views ensures both traders and portfolio managers have the right information at the right level of detail.
