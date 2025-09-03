 <Card className="relative overflow-hidden text-white min-h-[350px] rounded-2xl">
                {/* Background gradient (behind everything) */}
                {/* bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-purple-800/90 */}
                <div className={`absolute inset-0 -z-10 ${background}`} />

                {/* Optional decorative layers (remove if you want it plainer) */}
                <div
                  className="absolute inset-0 -z-10 opacity-40 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15), transparent 65%)",
                  }}
                />
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 8px)",
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 -z-10 bg-gradient-to-b from-white/10 to-transparent" />

                {/* Image block anchored bottom-left */}
                <div className="absolute top-[70%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-[400px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/15 bg-black/20 backdrop-blur-sm">
                    <Image
                      src={
                        project_images && project_images.length > 0
                          ? project_images[0].thumbnail_url
                          : "/placeholder.svg"
                      }
                      alt={title || "Project mockup"}
                      width={300}
                      height={300}
                      className="object-cover w-full h-auto select-none"
                      priority
                    />
                    {/* Soft glow */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-fuchsia-400/20 via-purple-400/10 to-transparent" />
                  </div>
                </div>

                {/* (Add future textual content here if needed) */}
              </Card>