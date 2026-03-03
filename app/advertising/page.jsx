"use client";

import React from "react";
import { H1, H2, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  FaFileDownload,
  FaEye,
  FaBullhorn,
  FaEnvelope,
  FaBolt,
  FaRocket,
  FaShieldAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdvertisingPage() {
  const packages = [
    {
      name: "FIELD UNIT",
      price: "$500/mo",
      features: [
        "Banner integration (728x90)",
        "Intelligence Report mention",
        "Social frequency level 1",
        "Standard editorial slot",
      ],
      color: "bg-blue-500",
    },
    {
      name: "COMMAND CENTER",
      price: "$1,200/mo",
      features: [
        "High-impact banner (970x250)",
        "Intelligence Report lead",
        "Dedicated analysis piece",
        "Direct podcast sponsorship",
        "Full event integration",
      ],
      popular: true,
      color: "bg-brand-500",
    },
    {
      name: "ENTERPRISE CORE",
      price: "CUSTOM",
      features: [
        "Global Hub takeover",
        "Custom R&D campaigns",
        "Signature event partner",
        "Multi-vector channel access",
        "Dedicated mission director",
      ],
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20 text-text">
      <header className="mb-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[300px] w-[500px] bg-brand-500/10 blur-[120px] rounded-full" />
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface border border-border/50 mb-8">
          <FaBolt className="text-brand-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            High Impact Placements
          </span>
        </div>
        <H1 className="mb-6 text-6xl md:text-8xl font-black uppercase italic tracking-tighter decoration-brand-500 underline underline-offset-[12px] decoration-8 leading-[0.9]">
          AMPLIFY YOUR INTEL
        </H1>
        <Muted className="max-w-3xl mx-auto text-xl md:text-2xl font-black uppercase tracking-tight leading-tight italic mt-12">
          Reach the frontliners of Liberia&apos;s digital revolution. Connect
          your brand with true innovators.
        </Muted>
      </header>

      <div className="grid gap-8 md:grid-cols-3 mb-24">
        {packages.map((pkg, idx) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative group h-full`}
          >
            <Card
              className={`h-full p-8 bg-surface border-2 shadow-2xl flex flex-col transition-all duration-500 hover:scale-[1.02] ${pkg.popular ? "border-brand-500 bg-brand-500/5" : "border-border/50 hover:border-brand-500/50"}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-6 py-2 rounded-full bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-500/40">
                    MISSION CRITICAL
                  </span>
                </div>
              )}

              <div className="mb-10 text-center">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
                  {pkg.name}
                </h3>
                <div className="text-5xl font-black text-brand-500 italic uppercase tracking-tighter">
                  {pkg.price}
                </div>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-4 text-xs font-bold uppercase tracking-widest text-muted italic"
                  >
                    <span className="text-brand-500">→</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                as="a"
                href="mailto:ads@liberiadigitalinsights.com"
                className={`w-full py-6 font-black uppercase tracking-widest scale-100 active:scale-95 transition-transform ${pkg.popular ? "bg-brand-500 hover:bg-brand-600" : "variant-outline"}`}
              >
                Deploy Now
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <section className="bg-surface rounded-[40px] p-12 md:p-20 border border-border/50 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-brand-500/5 blur-[100px]" />
        <div className="grid gap-16 md:grid-cols-2">
          <div className="space-y-8">
            <H2 className="text-4xl font-black uppercase italic tracking-tighter text-brand-500 underline decoration-8 underline-offset-8">
              THE ADVANTAGE
            </H2>
            <div className="space-y-10 mt-12">
              {[
                {
                  icon: FaRocket,
                  title: "Velocity",
                  desc: "Accelerate your brand visibility within the tech decision-maker ecosystem.",
                },
                {
                  icon: FaShieldAlt,
                  title: "Authority",
                  desc: "Leverage our trusted editorial voice to establish market leadership.",
                },
                {
                  icon: FaEye,
                  title: "Intelligence",
                  desc: "Get granular metrics on your impact across multiple campaign vectors.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <item.icon className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted font-bold uppercase tracking-widest">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-3xl p-10 border border-border/50 shadow-inner flex flex-col justify-center text-center">
            <FaEnvelope className="text-6xl text-brand-500 mx-auto mb-8 animate-bounce" />
            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
              Request Media Kit
            </h3>
            <p className="text-muted font-bold uppercase tracking-widest text-sm mb-10 leading-relaxed">
              Get the full data on our demographics, engagement metrics, and
              custom integration opportunities.
            </p>
            <Button className="font-black uppercase tracking-widest py-6">
              sales@ldi.intelligence
            </Button>
            <Muted className="mt-8 text-[9px] font-black uppercase tracking-widest">
              Response time: ≤ 24 hours
            </Muted>
          </div>
        </div>
      </section>
    </div>
  );
}
