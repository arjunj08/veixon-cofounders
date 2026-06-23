/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class", "[data-theme='dark']"],
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      './app/**/*.{js,jsx,ts,tsx}',
      './lib/**/*.{js,jsx,ts,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
    ],
    prefix: "",
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'var(--border)',
    			input: 'var(--border)',
    			ring: 'var(--purple)',
    			background: 'var(--bg-primary)',
    			foreground: 'var(--text-primary)',
          mutedText: 'var(--text-muted)',
          purple: 'var(--purple)',
          teal: 'var(--teal)',
          amber: 'var(--amber)',
          danger: 'var(--red)',
          card: 'var(--card-bg)',
    			primary: {
    				DEFAULT: 'var(--purple)',
    				foreground: 'white'
    			},
    			secondary: {
    				DEFAULT: 'var(--bg-secondary)',
    				foreground: 'var(--text-primary)'
    			},
    			destructive: {
    				DEFAULT: 'var(--red)',
    				foreground: 'white'
    			},
    			muted: {
    				DEFAULT: 'var(--bg-tertiary)',
    				foreground: 'var(--text-muted)'
    			},
    			accent: {
    				DEFAULT: 'var(--purple-light)',
    				foreground: 'var(--purple)'
    			},
    			popover: {
    				DEFAULT: 'var(--card-bg)',
    				foreground: 'var(--text-primary)'
    			},
    			chart: {
    				'1': 'var(--purple)',
    				'2': 'var(--teal)',
    				'3': 'var(--amber)',
    				'4': 'var(--red)',
    				'5': 'var(--purple-dim)'
    			},
    			sidebar: {
    				DEFAULT: 'var(--bg-tertiary)',
    				foreground: 'var(--text-primary)',
    				primary: 'var(--purple)',
    				'primary-foreground': 'white',
    				accent: 'var(--bg-secondary)',
    				'accent-foreground': 'var(--text-primary)',
    				border: 'var(--border)',
    				ring: 'var(--purple)'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
          'vzn-pulse': 'vznPulse 2.5s infinite'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
  }
