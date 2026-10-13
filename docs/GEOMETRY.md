# Geometry / Géométrie

Distances in mm. Origin at the bottom bracket; +X forward, +Y upward. Stack/reach locate the head-tube top. Head angle h is measured from horizontal. Stem length L is centre-to-centre; signed stem angle a is relative to the perpendicular to the upward steerer (−6° lowers the stem). Symmetric clamp assumed.

```text
z = spacers + headset cover + clamp height / 2
θ = 90° − h + a
X = reach − z cos(h) + L cos(θ)
Y = stack + z sin(h) + L sin(θ)
Δ = cockpit B − cockpit A
```

Trig inputs are converted to radians. Calculations are not rounded internally; output is rounded to 0.1 mm. Display precision does not guarantee input accuracy. Plot fits measured head-tube/cockpit points; it is not a manufacturer frame silhouette.

Repères : origine au boîtier, X vers l’avant, Y vers le haut. Angle potence signé depuis la perpendiculaire au pivot. Δ = B − A, en mm. Les limites de saisie sont des contrôles de plausibilité, pas des recommandations de montage.

Fixture indépendante : h=60°, a=−30°, L=100, z=30 donne X=reach+85 et Y=stack+15√3. Ajouter 20 mm de spacers à 73° donne ΔX=−5.847434094 et ΔY=+19.126095119 mm.

Excludes saddle position, hoods/bar reach, suspension sag, flex and comfort/medical/size predictions. No manufacturer catalogue or scraping. Follow component and spacer limits from the manufacturer.
